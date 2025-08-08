const route=require("./loginin/login")
const notesroutes=require("./routes/notes")
const express =require("express")
const app= express()
const port=3000
const router=express.Router()
app.use(express.json())
app.use(express.urlencoded())
app.use("/", route )
app.use("/",notesroutes)

app.get("/home",(req,res)=>{
    res.send("working")
})


app.listen(port,()=>
{
    console.log(`server is working at port ${port}`)
})