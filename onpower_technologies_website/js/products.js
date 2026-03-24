const products = [

{
id:1,
name:"NE555 Timer IC",
price:20,
category:"IC",
image:"images/555.jpg"
},

{
id:2,
name:"IRFZ44N MOSFET",
price:35,
category:"MOSFET",
image:"images/mosfet.jpg"
},

{
id:3,
name:"1K Resistor",
price:2,
category:"Resistor",
image:"images/resistor.jpg"
},

{
id:4,
name:"10K Resistor",
price:2,
category:"Resistor",
image:"images/resistor.jpg"
}

]

function displayProducts(list){

const container=document.getElementById("product-list")
container.innerHTML=""

list.forEach(p=>{

container.innerHTML+=`

<div class="product-card">

<img src="${p.image}">
<h4>${p.name}</h4>
<p>₹${p.price}</p>

<button onclick="addToCart(${p.id})">
Add to Cart
</button>

</div>

`

})

}

displayProducts(products)

function filterCategory(cat){

if(cat==="all"){
displayProducts(products)
return
}

const filtered = products.filter(p=>p.category===cat)

displayProducts(filtered)

}