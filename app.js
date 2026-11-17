'use strict';
const root='assets/img/';
const products=[
  {id:'boxy',name:'Boxy Tee / Stone',category:'tops',price:38,image:root+'image.png',alt:'Fashion editorial image of a minimal streetwear top',tag:'01 / CORE',desc:'Relaxed proportions. An unstructured silhouette in a cool, quiet tone.',sizes:['XS','S','M','L','XL']},
  {id:'cargo',name:'Utility Trouser / Ink',category:'bottoms',price:86,image:root+'image4.png',alt:'Northline model photographed in contemporary streetwear',tag:'02 / MOVEMENT',desc:'An imagined utility trouser built for free movement and changing plans.',sizes:['S','M','L','XL']},
  {id:'coach',name:'Everyday Layer / Ash',category:'layers',price:110,image:root+'image3.png',alt:'Dark-toned fashion editorial still-life',tag:'03 / LAYER',desc:'A deliberately simple layer with a carefully considered outline.',sizes:['S','M','L','XL']},
  {id:'cap',name:'Studio Cap / Oat',category:'accessories',price:28,image:root+'image2.png',alt:'Neutral fashion accessory in the Northline collection',tag:'04 / OBJECT',desc:'A compact everyday detail, imagined in an understated neutral tone.',sizes:['OS']},
  {id:'longsleeve',name:'Long Sleeve / Chalk',category:'tops',price:52,image:root+'image5.png',alt:'Northline studio garment detail',tag:'05 / STANDARD',desc:'An easy layer with an intentionally relaxed shape and soft finish.',sizes:['XS','S','M','L','XL']},
  {id:'outer',name:'Outer Shell / Olive',category:'layers',price:132,image:root+'image4.png',alt:'Model in fashion editorial outerwear',tag:'06 / STUDY',desc:'Weather-ready, compact, adaptable, and full of attitude.',sizes:['S','M','L','XL']}
];
const $=selector=>document.querySelector(selector);
const $$=selector=>Array.from(document.querySelectorAll(selector));
let category='all',activeProduct=null,selectedSize=null,bag=[];
try {const data=JSON.parse(sessionStorage.getItem('northlineConceptBag')||'[]');if(Array.isArray(data))bag=data.filter(item=>products.some(p=>p.id===item.id&&p.sizes.includes(item.size))).slice(0,30)} catch {}
const formatPrice=n=>'$'+n.toFixed(2);
function renderProducts(){
  const listed=products.filter(p=>category==='all'||p.category===category);
  $('#filter-count').textContent=String(listed.length).padStart(2,'0')+' PIECE'+(listed.length===1?'':'S')+' ON DISPLAY';
  $('#product-grid').innerHTML=listed.map((p,i)=>`<article class="product" data-product="${p.id}"><button class="product-image" type="button" data-open-product="${p.id}" aria-label="Explore ${p.name}"><img src="${p.image}" alt="${p.alt}" loading="${i===0?'eager':'lazy'}"><span class="product-index">NL / ${String(products.indexOf(p)+1).padStart(2,'0')}</span><span class="product-open" aria-hidden="true">↗</span></button><div class="product-info"><div><span class="product-tag">${p.tag}</span><h3>${p.name}</h3><p>SELECT A SIZE &amp; PREVIEW</p></div><div class="product-price"><strong>${formatPrice(p.price)}</strong><button type="button" data-open-product="${p.id}" aria-label="View ${p.name} product details">DETAILS ↗</button></div></div></article>`).join('');
}
const productGrid=$('#product-grid');
$$('.filter').forEach(button=>button.addEventListener('click',()=>{category=button.dataset.filter;$$('.filter').forEach(b=>{const active=b===button;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active))});renderProducts()}));
const quick=$('#quick-dialog'),cart=$('#bag-dialog');
productGrid.addEventListener('click',event=>{const button=event.target.closest('[data-open-product]');if(!button)return;const product=products.find(p=>p.id===button.dataset.openProduct);if(!product)return;activeProduct=product;selectedSize=null;
  $('#quick-image').src=product.image;$('#quick-image').alt=product.alt;$('#quick-title').textContent=product.name;$('#quick-desc').textContent=product.desc;$('#quick-category').textContent=product.tag+' / NORTHLINE ISSUE 04';$('#quick-price').textContent=formatPrice(product.price);
  const add=$('#quick-add');add.textContent='SELECT A SIZE TO ADD ↗';
  const wrap=$('#quick-sizes');wrap.replaceChildren(...product.sizes.map(size=>{const button=document.createElement('button');button.textContent=size;button.type='button';button.setAttribute('aria-pressed','false');button.addEventListener('click',()=>{selectedSize=size;Array.from(wrap.children).forEach(b=>{const active=b===button;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active))});add.textContent='ADD TO BAG ↗'});return button}));quick.showModal();
});
$('#quick-add').addEventListener('click',()=>{if(!activeProduct||!selectedSize){$('#quick-sizes button')?.focus();return}bag.push({id:activeProduct.id,size:selectedSize});persist();quick.close();openBag()});
$$('[data-quick-close]').forEach(b=>b.addEventListener('click',()=>quick.close()));
function persist(){try{sessionStorage.setItem('northlineConceptBag',JSON.stringify(bag))}catch{}updateCount()}
function updateCount(){const n='('+bag.length+')';$('#bag-count').textContent=n;$('#bag-dialog-count').textContent=n}
function renderBag(){const region=$('#bag-items');region.replaceChildren();if(!bag.length){const p=document.createElement('p');p.className='bag-empty';p.textContent='Nothing in your bag yet. Browse the collection and choose a size.';region.append(p)}
  bag.forEach((entry,i)=>{const product=products.find(p=>p.id===entry.id);if(!product)return;const row=document.createElement('div');row.className='bag-row';const img=document.createElement('img');img.src=product.image;img.alt=product.alt;
   const details=document.createElement('div');const title=document.createElement('h3');title.textContent=product.name;const size=document.createElement('p');size.textContent='SIZE / '+entry.size;const remove=document.createElement('button');remove.type='button';remove.textContent='REMOVE ↗';remove.setAttribute('aria-label','Remove '+product.name+' size '+entry.size);remove.addEventListener('click',()=>{bag.splice(i,1);persist();renderBag()});details.append(title,size,remove);
   const price=document.createElement('strong');price.textContent=formatPrice(product.price);row.append(img,details,price);region.append(row)});
  $('#bag-subtotal').textContent=formatPrice(bag.reduce((total,entry)=>total+(products.find(p=>p.id===entry.id)?.price||0),0));
}
function openBag(){renderBag();cart.showModal()}
$$('[data-cart-open]').forEach(b=>b.addEventListener('click',openBag));
$$('[data-cart-close]').forEach(b=>b.addEventListener('click',()=>cart.close()));
$('#clear-bag').addEventListener('click',()=>{bag=[];persist();renderBag()});
for(const dialog of [quick,cart])dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close()});
$('#waitlist-form').addEventListener('submit',event=>{event.preventDefault();const field=$('#email');if(!field.reportValidity())return;$('#waitlist-result').textContent='THANKS FOR EXPLORING. SIGNUP IS NOT ACTIVE; NO EMAIL WAS STORED OR SENT.';field.value=''});
const toggle=$('.menu-toggle');toggle.addEventListener('click',()=>{const opened=$('#primary-nav').classList.toggle('open');toggle.setAttribute('aria-expanded',String(opened))});$$('.nav a').forEach(link=>link.addEventListener('click',()=>{$('#primary-nav').classList.remove('open');toggle.setAttribute('aria-expanded','false')}));
$('#year').textContent=new Date().getFullYear();renderProducts();updateCount();
