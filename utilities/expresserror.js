class expresserror extends Error{
    constructor(message,status){
        super();
        this.message=message;
        this.status=status;
    }
}

module.exports=expresserror;