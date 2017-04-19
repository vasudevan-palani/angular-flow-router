var parser = require('xml2json');
var fs = require('fs');
var prettyjson = require('prettyjson');
var beautify = require('js-beautify').js_beautify;

exports.xml2Route = function(xmlFile,routeFile) {
    var json = getJSON(xmlFile);
    var states = getStatesAndEdges(json);
    var routeString = getRouteString(states);

    fs.writeFile(routeFile, routeString, function(err) {
        if (err) {
            return console.log(err);
        }
        console.log("Routes transformed to " + routeFile);
    });
}

function getJSON(filename) {
    var xml = fs.readFileSync(filename, 'utf8');
    return JSON.parse(parser.toJson(xml));
}


function getStatesAndEdges(json) {
    // If object exists
    //
    if (json["mxGraphModel"]["root"]["object"]) {

        // Handle only one object
        //
        if (!json["mxGraphModel"]["root"]["object"] instanceof Array) {
            json["mxGraphModel"]["root"]["mxCell"].push(json["mxGraphModel"]["root"]["object"]);
        } else {
            json["mxGraphModel"]["root"]["object"].map(function(item) {
                item.name = item.label;
                item.value = item.label;

                json["mxGraphModel"]["root"]["mxCell"].push(item);
            });
        }
    }

    // Loop through each mxCell which has a value/label attributes
    //
    var states = {};
    json["mxGraphModel"]["root"]["mxCell"].map(function(cell) {
        if (cell.value || cell.label) {
            states[cell.id] = cell;
            states[cell.id]['name'] = cell.value || cell.label;
        }
    });

    //Loop through each state and mark them as edge if they are
    //
    Object.keys(states).map(function(stateKey) {
        json["mxGraphModel"]["root"]["mxCell"].map(function(cell) {
            if (states[stateKey].parent == cell.id && cell.edge) {
                states[stateKey].edge = true;
                states[stateKey].source = cell.source;
                states[stateKey].target = cell.target;
            }
        });
    });

    //Set the on for each state
    //
    Object.keys(states).map(function(stateKey) {
        if (states[stateKey].edge) {
            states[states[stateKey].source]['on'] = states[states[stateKey].source]['on'] ? states[states[stateKey].source]['on'] : [];
            states[states[stateKey].source]['on'].push("\"" + states[stateKey].name + "\":\"" + states[states[stateKey].target]['name'] + "\"");
        }
    });

    //Remove edge states
    //
    Object.keys(states).map(function(stateKey) {
        if (states[stateKey].edge) {
            delete states[stateKey];
        }
    });
    return states;
}

function getRouteString(states) {
    var routestring = "";
    Object.keys(states).map(function(stateId) {
        var state = states[stateId];
        var stateString = [];
        Object.keys(state).map(function(stateKey) {
            if (stateKey == "controllerName" ||
                stateKey == "on" ||
                stateKey == "resolve" ||
                stateKey == "controllerAs" ||
                stateKey == "templateUrl") {

                if (stateKey == "controllerName" || stateKey == "templateUrl") {
                    stateString.push(stateKey + ":" + JSON.stringify(state[stateKey]));
                } else if (stateKey == "on") {
                    stateString.push(stateKey + ":" + "{" + state[stateKey].join() + "}");
                } else {
                    stateString.push(stateKey + ":" + state[stateKey]);
                }
            }
        });
        routestring = routestring + "$routeProvider.when('" + state.name + "',{" + stateString.join() + "});";
    });

    var header = "(function () { angular.module('app').config(['$routeProvider',function ($routeProvider) {";
    return beautify(header + routestring + "}]);})()", {
        indent_size: 2
    });
}
