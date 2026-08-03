const state = {
  companyName: 'Sri Mahavishnu Colour Graphicz', companyAddress: '1073/3, P.K.N Road, Near Rathna Vilas Bus Stop, Sivakasi, Tamil Nadu - 626189', companyEmail: 'colourgraphiczdesigner@gmail.com', companyPhone: '+91 87784 83441, +91 84282 83232',
  projectId: 'PRJ-001', invoiceDate: new Date().toISOString().slice(0, 10), invoiceId: 'INV-001', customerName: 'Customer Name', customerAddress: 'Customer address', customerPhone: '+91 00000 00000', projectDescription: 'Final design and print production work.',
  advance: 0, amountPaid: 0, tax: 0, notes: 'Final design files will be shared after 50% advance payment. Delivery within 7 days after final approval. Terms and conditions apply.', accountDetails: 'Account Name: YOGESWARAN S\nAccount Number: 23100050311545\nIFSC Code: TMBL0000231\nBranch: THIRUTHANGAL\nBank: Tamilnad Mercantile Bank',
  items: [{ project: 'Business card design', material: 'Art board', qty: 1, price: 1200 }, { project: 'Flex banner', material: 'Vinyl', qty: 2, price: 850 }]
};

const rupee = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' });
const fields = document.querySelectorAll('.bind');
const itemsBody = document.querySelector('#itemsBody');
const toast = new bootstrap.Toast(document.querySelector('#appToast'));

function showToast(message) { document.querySelector('#toastMessage').textContent = message; toast.show(); }
function numberValue(value) { return Number.parseFloat(value) || 0; }
function escapeXml(value) { return String(value ?? '').replace(/[<>&"']/g, char => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;' }[char])); }
function readXmlText(node, tag, fallback = '') { return node.querySelector(tag)?.textContent ?? fallback; }

function amountInWords(value) {
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  const underHundred = n => n < 20 ? ones[n] : `${tens[Math.floor(n / 10)]} ${ones[n % 10]}`.trim();
  const underThousand = n => `${n >= 100 ? `${ones[Math.floor(n / 100)]} Hundred ` : ''}${underHundred(n % 100)}`.trim();
  let n = Math.round(value);
  if (!n) return 'Zero rupees only';
  const parts = [];
  [['Crore', 10000000], ['Lakh', 100000], ['Thousand', 1000]].forEach(([label, size]) => { if (n >= size) { parts.push(`${underThousand(Math.floor(n / size))} ${label}`); n %= size; } });
  if (n) parts.push(underThousand(n));
  return `${parts.join(' ')} rupees only`;
}

function render() {
  fields.forEach(input => { if (document.activeElement !== input) input.value = state[input.dataset.bind] ?? ''; });
  document.querySelectorAll('[data-view]').forEach(el => { el.textContent = state[el.dataset.view] ?? ''; });
  itemsBody.innerHTML = state.items.map((item, index) => `
    <tr>
      <td class="text-center fw-bold">${index + 1}</td>
      <td><input class="form-control item-input" data-index="${index}" data-key="project" value="${escapeXml(item.project)}"></td>
      <td><input class="form-control item-input" data-index="${index}" data-key="material" value="${escapeXml(item.material)}"></td>
      <td><input type="number" min="0" class="form-control item-input text-end" data-index="${index}" data-key="qty" value="${escapeXml(item.qty)}"></td>
      <td><input type="number" min="0" class="form-control item-input text-end" data-index="${index}" data-key="price" value="${escapeXml(item.price)}"></td>
      <td class="text-end fw-bold">${rupee.format(numberValue(item.qty) * numberValue(item.price))}</td>
      <td class="text-center no-print"><button class="btn btn-sm btn-outline-danger remove-item" data-index="${index}">Remove</button></td>
    </tr>`).join('');
  const subtotal = state.items.reduce((sum, item) => sum + numberValue(item.qty) * numberValue(item.price), 0);
  const grand = subtotal + numberValue(state.tax);
  const balance = grand - numberValue(state.advance) - numberValue(state.amountPaid);
  document.querySelector('#subtotalView').textContent = rupee.format(subtotal);
  document.querySelector('#taxView').textContent = rupee.format(numberValue(state.tax));
  document.querySelector('#advanceView').textContent = rupee.format(numberValue(state.advance));
  document.querySelector('#paidView').textContent = rupee.format(numberValue(state.amountPaid));
  document.querySelector('#grandView').textContent = rupee.format(grand);
  document.querySelector('#balanceView').textContent = rupee.format(balance);
  document.querySelector('#wordsView').textContent = amountInWords(grand);
  localStorage.setItem('vproBillingDraft', JSON.stringify(state));
}

function invoiceXml() {
  const itemXml = state.items.map((item, index) => `<item serial="${index + 1}"><project>${escapeXml(item.project)}</project><material>${escapeXml(item.material)}</material><qty>${escapeXml(item.qty)}</qty><price>${escapeXml(item.price)}</price><amount>${numberValue(item.qty) * numberValue(item.price)}</amount></item>`).join('');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<invoice><company><name>${escapeXml(state.companyName)}</name><address>${escapeXml(state.companyAddress)}</address><email>${escapeXml(state.companyEmail)}</email><phone>${escapeXml(state.companyPhone)}</phone></company><customer><name>${escapeXml(state.customerName)}</name><address>${escapeXml(state.customerAddress)}</address><phone>${escapeXml(state.customerPhone)}</phone></customer><project><id>${escapeXml(state.projectId)}</id><description>${escapeXml(state.projectDescription)}</description></project><invoiceId>${escapeXml(state.invoiceId)}</invoiceId><invoiceDate>${escapeXml(state.invoiceDate)}</invoiceDate><tax>${escapeXml(state.tax)}</tax><advance>${escapeXml(state.advance)}</advance><amountPaid>${escapeXml(state.amountPaid)}</amountPaid><notes>${escapeXml(state.notes)}</notes><accountDetails>${escapeXml(state.accountDetails)}</accountDetails><items>${itemXml}</items></invoice>`;
}
function downloadXml(filename = `${state.invoiceId || 'invoice'}.xml`) { const blob = new Blob([invoiceXml()], { type: 'application/xml' }); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = filename; a.click(); URL.revokeObjectURL(a.href); showToast('XML downloaded successfully'); }

fields.forEach(input => input.addEventListener('input', e => { const key = e.target.dataset.bind; state[key] = e.target.type === 'number' ? numberValue(e.target.value) : e.target.value; render(); }));
itemsBody.addEventListener('input', e => { if (!e.target.matches('.item-input')) return; const { index, key } = e.target.dataset; state.items[index][key] = e.target.type === 'number' ? numberValue(e.target.value) : e.target.value; render(); });
itemsBody.addEventListener('click', e => { if (!e.target.matches('.remove-item')) return; state.items.splice(Number(e.target.dataset.index), 1); render(); showToast('Item removed'); });
document.querySelector('#addItemBtn').addEventListener('click', () => { state.items.push({ project: 'New project', material: 'Material', qty: 1, price: 0 }); render(); });
document.querySelector('#clearItemsBtn').addEventListener('click', () => { if (confirm('Delete all invoice items?')) { state.items = []; render(); } });
document.querySelector('#saveBtn').addEventListener('click', () => downloadXml());
document.querySelector('#saveAsBtn').addEventListener('click', () => downloadXml(`${prompt('Save XML as', state.invoiceId || 'invoice') || 'invoice'}.xml`));
document.querySelector('#printBtn').addEventListener('click', () => window.print());
document.querySelector('#uploadXml').addEventListener('change', async e => { const file = e.target.files[0]; if (!file) return; const xml = new DOMParser().parseFromString(await file.text(), 'application/xml'); state.companyName = readXmlText(xml, 'company > name', state.companyName); state.companyAddress = readXmlText(xml, 'company > address', state.companyAddress); state.companyEmail = readXmlText(xml, 'company > email', state.companyEmail); state.companyPhone = readXmlText(xml, 'company > phone', state.companyPhone); state.customerName = readXmlText(xml, 'customer > name', state.customerName); state.customerAddress = readXmlText(xml, 'customer > address', state.customerAddress); state.customerPhone = readXmlText(xml, 'customer > phone', state.customerPhone); state.projectId = readXmlText(xml, 'project > id', state.projectId); state.projectDescription = readXmlText(xml, 'project > description', state.projectDescription); ['invoiceId', 'invoiceDate', 'tax', 'advance', 'amountPaid', 'notes', 'accountDetails'].forEach(key => state[key] = readXmlText(xml, key, state[key])); state.items = [...xml.querySelectorAll('items item')].map(item => ({ project: readXmlText(item, 'project'), material: readXmlText(item, 'material'), qty: numberValue(readXmlText(item, 'qty')), price: numberValue(readXmlText(item, 'price')) })); render(); showToast('XML uploaded and loaded'); });

Object.assign(state, JSON.parse(localStorage.getItem('vproBillingDraft') || '{}'));
render();
