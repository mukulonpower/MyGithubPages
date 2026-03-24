let cart=[]
let total=0

function addToCart(id){

const product = products.find(p=>p.id===id)

cart.push(product)

total+=product.price

document.getElementById("total").innerText=total

const li=document.createElement("li")

li.innerText=product.name+" ₹"+product.price

document.getElementById("cart").appendChild(li)

updateWhatsApp()

}

function updateWhatsApp(){

let text="Order:%0A"

cart.forEach(item=>{
text+=item.name+" ₹"+item.price+"%0A"
})

text+="Total ₹"+total

document.getElementById("checkout").href=
"https://wa.me/91YOURNUMBER?text="+text

}