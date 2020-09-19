function stringOrThrow(variableName: string): string {
    const val = process.env[variableName]
    if(typeof(val) === 'string'){
        return val
    }
    throw new Error(`${variableName} must be defined as string`)
}

const config = {
    tableName: stringOrThrow("TABLE_NAME")
}

export default config