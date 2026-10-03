(function(){
  var page=document.querySelector('.commercial-page');if(!page)return;
  var spanish=document.documentElement.lang.indexOf('es')===0;
  page.setAttribute('data-discount',spanish?'0.6':'1');page.setAttribute('data-default-currency',spanish?'PEN':'USD');
  var languageSelector=page.querySelector('.language-selector');if(languageSelector){var controls=document.createElement('div');controls.className='currency-switcher';controls.innerHTML=(spanish?'<button type="button" data-currency="PEN">🇵🇪 Sol peruano</button><button type="button" data-currency="EUR">🇪🇺 Euro</button><button type="button" data-currency="CLP">🇨🇱 Peso chileno</button><button type="button" data-currency="ARS">🇦🇷 Peso argentino</button>':'<button type="button" data-currency="USD">🇺🇸 US dollar</button>')+'<p class="currency-rate-note" aria-live="polite"></p>';languageSelector.insertAdjacentElement('afterend',controls);}
  var rates={USD:.1914,EUR:.1703,PEN:.6738,CLP:188.846,ARS:292.5};
  var locales={USD:'en-US',EUR:'es-ES',PEN:'es-PE',CLP:'es-CL',ARS:'es-AR'};
  var symbols={USD:'USD',EUR:'EUR',PEN:'PEN',CLP:'CLP',ARS:'ARS'};
  var discount=Number(page.getAttribute('data-discount')||1), nodes=[];
  var walker=document.createTreeWalker(page,NodeFilter.SHOW_TEXT);
  while(walker.nextNode()){var n=walker.currentNode;if(/R\$\s*[\d.,]/.test(n.nodeValue)){nodes.push({node:n,original:n.nodeValue});}}
  function number(value){return Number(value.replace(/[.,]/g,''));}
  function money(value,currency){return new Intl.NumberFormat(locales[currency],{style:'currency',currency:currency,maximumFractionDigits:0}).format(value);}
  function apply(currency){nodes.forEach(function(item){item.node.nodeValue=item.original.replace(/R\$\s*([\d.,]+)(?:\s*[–-]\s*([\d.,]+))?/g,function(_,a,b){var first=money(number(a)*rates[currency]*discount,currency);return b?first+' – '+money(number(b)*rates[currency]*discount,currency):first;});});document.querySelectorAll('[data-currency]').forEach(function(button){button.classList.toggle('active',button.getAttribute('data-currency')===currency);});var note=document.querySelector('.currency-rate-note');if(note){note.textContent='Base: 1 BRL = '+rates[currency]+' '+symbols[currency]+(discount<1?' · 40% OFF aplicado':'')+' · taxa de referência, sujeita a confirmação comercial.';}}
  document.querySelectorAll('[data-currency]').forEach(function(button){button.addEventListener('click',function(){apply(button.getAttribute('data-currency'));});});apply(page.getAttribute('data-default-currency'));
})();
