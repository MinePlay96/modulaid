module:
-- dependency = package.json dependency
-- soft dependency = package.json peerDependencies dependency
-- permissions  = package.json
--- array of buildin node modules that the module has access ["fs", "http", "https", "ws"]
--- access to soft- and dependency`s are allowed

module config can be set via master package.json
{
    "config": {
        "webserver-express": {
            "port": 8080
        }
    }
    "dependencies": {
        "webserver-express": "~4.2.0"
    }
}
