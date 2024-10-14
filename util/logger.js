class Logger{
    static info(value){
        try{
            console.log(`<<<<<<<<<</${value}>>>>>>>>>>`);
        }
        catch(error){
            console.log(error);
        }
    }

    static error(value){
        try{
            console.log(`<<<<<<<<<<${value}>>>>>>>>>>`);
        }
        catch(error){
            console.log(error)
        }
    }
}

module.exports = Logger;