document.getElementById("search").addEventListener("input",function(){

let value=this.value.toLowerCase()

let filtered = products.filter(p=>
p.name.toLowerCase().includes(value)
)

displayProducts(filtered)

})