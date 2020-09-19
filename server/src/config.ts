function stringOrThrow(variableName: string): string {
    const val = process.env[variableName]
    if(typeof(val) === 'string'){
        return val
    }
    throw new Error(`${variableName} must be defined as string`)
}

const requiredStringEnvVariables: { [key: string]: string; } = {
    tableName: "TABLE_NAME"
}

// enum optionalStringEnvVariables {
// }

const missing = Object.keys(requiredStringEnvVariables).reduce(
    (missingList: Array<string>, next: string) => {
        if(!process.env[requiredStringEnvVariables[next]]){
            missingList.push(requiredStringEnvVariables[next])
        }
        return missingList
    }, []
)
if(missing.length){
    const err = `These env variables must be defined as strings: ${missing.join(',')}`
    console.error(err)
    throw new Error(err)
}


const config = {
    tableName: stringOrThrow(requiredStringEnvVariables.tableName)
}

export default config