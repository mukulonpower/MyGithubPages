
function sendWhatsApp(){

  let name = document.getElementById("name").value;
  let email = document.getElementById("email").value;
  let msg = document.getElementById("msg").value;

  if(name=="" || email=="" ){
    alert("Please fill all fields");
    return;
  }

  let phone = "918476003531"; // your number

let text = `Hello OnPower Technologies,%0A%0A
I would like to request a quote.%0A%0A
Name: ${name}%0A
Email: ${email}%0A
Project Details: ${msg}%0A%0A

Please get back to me.`;

  let url = `https://wa.me/${phone}?text=${text}`;

  window.open(url, "_blank");
}


