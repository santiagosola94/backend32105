import parseArgs from "minimist";

const options = {
    alias: {
        p: "port"
    },
    default: {
        p: 8080
    }
}

const puerto = parseArgs(process.argv.slice(2), options)

export default puerto