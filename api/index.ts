import app from './src/app.js'
import envConfig from './src/Configs/envConfig.js'
import { startUp } from './src/Configs/seqDb.js'


app.listen(envConfig.Port, async()=>{
    try {
        await startUp(true)
        console.log(`Server is listening on port: ${envConfig.Port}\nServer in ${envConfig.Status}\nEverything is allright !! 😎`)
    } catch (error) {
        console.error('Error connecting app: ', error)
        //process.exit(1)
    }
})