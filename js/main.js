(function(){
var m=document.querySelector('.menu'),n=document.getElementById('nav');
if(m)m.addEventListener('click',function(){var o=n.classList.toggle('open');m.setAttribute('aria-expanded',o)});
var chips=document.querySelectorAll('.chip');
chips.forEach(function(c){c.addEventListener('click',function(){
 chips.forEach(function(x){x.setAttribute('aria-pressed',x===c)});
 document.querySelectorAll('#plist .pcard').forEach(function(p){p.hidden=!(c.dataset.f==='all'||p.dataset.cat===c.dataset.f)})})});
var f=document.getElementById('quote');
if(f){
 var q=new URLSearchParams(location.search).get('product');
 if(q)document.getElementById('msg').value='Product enquiry: '+q;
 f.addEventListener('submit',function(e){e.preventDefault();
  var n=f.name.value.trim(),em=f.email.value.trim(),msg=document.getElementById('msg').value.trim(),err=document.getElementById('err');
  if(!n||!/^\S+@\S+\.\S+$/.test(em)){err.textContent='Please enter your name and a valid email address.';return}
  err.textContent='';
  var t='Hello OnPower Technologies,\n\nI would like to request a quote.\n\nName: '+n+'\nEmail: '+em+'\nProject Details: '+msg+'\n\nPlease get back to me.';
  window.open('https://wa.me/918476003531?text='+encodeURIComponent(t),'_blank','noopener')})}
})();
