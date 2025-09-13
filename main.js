const demoProducts = [
  {id:'p1', title:'Classic Cotton T-Shirt', price:799.00, category:'apparel', image:'https://tse4.mm.bing.net/th/id/OIP.f0o5uIsAxoFjXNzZmxmAIgHaJ4?pid=Api&P=0&h=180', description:'100% cotton comfortable tee.'},
  {id:'p2', title:'Bluetooth Headphones', price:2499.00, category:'electronics', image:'https://tse2.mm.bing.net/th/id/OIP.NVR4qSZ0MG5NOhd8IdUHVAHaHa?pid=Api&P=0&h=180', description:'Wireless over-ear headphones.'},
  {id:'p3', title:'Stylish Hoodie', price:1299.00, category:'apparel', image:'https://i.pinimg.com/736x/a1/17/41/a117418f595e6065354ce926476a9c08.jpg', description:'Warm and cozy hoodie.'},
  {id:'p4', title:'Sunglasses', price:599.00, category:'accessories', image:'https://tse4.mm.bing.net/th/id/OIP.ekRwljALvjMlmcyai7bXSAHaHa?pid=Api&P=0&h=180', description:'UV protection sunglasses.'},
  {id:'p5', title:'Smart Watch', price:3999.00, category:'electronics', image:'https://tse1.mm.bing.net/th/id/OIP.XYAN281qy0ja7XvNniLUHwHaHa?pid=Api&P=0&h=180', description:'Activity tracking smart watch.'},
  {id:'p6', title:'Canvas Bag', price:499.00, category:'accessories', image:'https://tse4.mm.bing.net/th/id/OIP.Z3AVbopPtT6r_bxjn3XpeQHaHa?pid=Api&P=0&h=180', description:'Durable everyday bag.'}
];

localStorage.setItem('demo_products', JSON.stringify(demoProducts));

function $(sel){return document.querySelector(sel)}
function $all(sel){return Array.from(document.querySelectorAll(sel))}

const grid = $('#products-grid');
const cartBtn = $('#cart-btn');
const cartModal = $('#cart-modal');
const closeCart = $('#close-cart');
const cartCount = $('#cart-count');
const cartItemsEl = $('#cart-items');
const cartTotalEl = $('#cart-total');
const searchInput = $('#search');
const categorySelect = $('#category');

function renderProducts(products){
  grid.innerHTML = '';
  products.forEach(p=>{
    const div = document.createElement('div');
    div.className = 'product-card';
    div.innerHTML = `
      <div class="product-media" style="background-image:url('${p.image}')"></div>
      <div>
        <div class="product-title">${p.title}</div>
        <div class="product-price">₹${p.price.toFixed(2)}</div>
        <div style="color:#666;margin-top:8px">${p.description}</div>
      </div>
      <div class="product-actions">
        <a class="btn" href="product.html?id=${p.id}">View</a>
        <button class="btn add-cart" data-id="${p.id}">Add</button>
      </div>
    `;
    grid.appendChild(div);
  });
  bindAddButtons();
}

function bindAddButtons(){
  $all('.add-cart').forEach(btn=>{
    btn.onclick = ()=> addToCart(btn.dataset.id);
  });
}

function getCart(){
  return JSON.parse(localStorage.getItem('demo_cart')||'[]');
}
function saveCart(c){ localStorage.setItem('demo_cart', JSON.stringify(c)); updateCartCount(); }

function updateCartCount(){
  const c = getCart().reduce((s,i)=>s+i.qty,0);
  cartCount.innerText = c;
}

function addToCart(id){
  const p = demoProducts.find(x=>x.id===id);
  if(!p) return;
  const cart = getCart();
  const found = cart.find(i=>i.id===id);
  if(found) found.qty++;
  else cart.push({id:p.id,title:p.title,price:p.price,qty:1});
  saveCart(cart);
  alert('Added to cart (demo)');
}

function renderCartModal(){
  const cart = getCart();
  cartItemsEl.innerHTML = '';
  if(cart.length===0){ cartItemsEl.innerHTML = '<p>Your cart is empty.</p>'; cartTotalEl.innerText = '0.00'; return; }
  cart.forEach(item=>{
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `<div>${item.title} × ${item.qty}</div><div>₹${(item.price*item.qty).toFixed(2)}</div>`;
    cartItemsEl.appendChild(div);
  });
  const total = cart.reduce((s,i)=>s + i.price*i.qty,0);
  cartTotalEl.innerText = total.toFixed(2);
}

cartBtn && cartBtn.addEventListener('click', ()=>{
  cartModal.classList.remove('hidden');
  renderCartModal();
});
closeCart && closeCart.addEventListener('click', ()=> cartModal.classList.add('hidden'));
window.addEventListener('click', e=>{ if(e.target===cartModal) cartModal.classList.add('hidden') });

searchInput && searchInput.addEventListener('input', ()=>{
  filterAndRender();
});
categorySelect && categorySelect.addEventListener('change', ()=> filterAndRender());

function filterAndRender(){
  const q = (searchInput.value||'').toLowerCase();
  const cat = categorySelect.value;
  const filtered = demoProducts.filter(p=>{
    const matchQ = p.title.toLowerCase().includes(q) || (p.description||'').toLowerCase().includes(q);
    const matchCat = cat==='all' || p.category===cat;
    return matchQ && matchCat;
  });
  renderProducts(filtered);
}

renderProducts(demoProducts);
updateCartCount();
