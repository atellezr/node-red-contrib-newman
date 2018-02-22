[![NPM version](https://badge.fury.io/js/node-red-contrib-newman.svg)](http://badge.fury.io/js/node-red-contrib-newman)
[![dependencies Status](https://david-dm.org/atellezr/node-red-contrib-newman/status.svg)](https://david-dm.org/atellezr/node-red-contrib-newman)
[![npm](https://img.shields.io/npm/dw/node-red-contrib-newman.svg)](https://www.npmjs.com/package/node-red-contrib-newman)
[![npm](https://img.shields.io/npm/dt/node-red-contrib-newman.svg)](https://www.npmjs.com/package/node-red-contrib-newman)

# node-red-contrib-newman

## Summary

Postman's [Newman](https://github.com/postmanlabs/newman) integration in [Node-RED](https://nodered.org/)

You can launch easily a [postman collection](https://www.getpostman.com/collection) using the runner, that is called Newman, within just 1 node:
![Easy use](doc/img/example_flow1.png)

You can configure the node with the full functionalities that newman offers, since the node's configuration is intented to be a free-text box where configure the options that you want to use that [newman accepts](https://github.com/postmanlabs/newman#newmanrunoptions-object--callback-function--run-eventemitter). This input box is parsed with **mustache**, making more powerfull the execution without the necessity of additional nodes.

![Easy use](doc/img/node_config_example.png)

## Dependencies

* [newman](https://github.com/postmanlabs/newman): the library for which this project has been build
* [mustache](https://github.com/janl/mustache.js): for rendering the options entered in the node configuration

## Usage and configuration
