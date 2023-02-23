const command_geteco = require( './command-geteco' );
const command_test = require( './command-test' );
const handler_help = require( './handler-help' );
const handler_on_message = require( './handler-on-message' );
const handler_on_text = require( './handler-on-text' );
const handler_start = require( './handler-start' );

module.exports = {
    command_geteco,
    command_test,
    handler_help,
    handler_on_message,
    handler_on_text,
    handler_start,
};
