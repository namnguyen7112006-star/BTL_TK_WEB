(() => {
  const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
  const KEY = 'lmd_health_patients_v1';
  let patients = []; try { patients = JSON.parse(localStorage.getItem(KEY) || '[]'); } catch (_) {}
  let page = 1, sortKey = 'createdAt', sortDir = -1, toastTimer;
  const listView = $('#listView'), addView = $('#addView'), modal = $('#modal'), rows = $('#patientRows');
  function save(){ try { localStorage.setItem(KEY, JSON.stringify(patients)); } catch(e){ toast('Không thể lưu dữ liệu trong trình duyệt.', true); } }
  function esc(v){ return String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
  function toast(msg, error=false){ const t=$('#toast'); t.textContent=msg; t.style.background=error?'#b83245':'#1f8f5f'; t.classList.add('show'); clearTimeout(toastTimer); toastTimer=setTimeout(()=>t.classList.remove('show'),2600); }
  function years(){ $$('.birth-year').forEach(s=>{s.innerHTML='';for(let y=new Date().getFullYear();y>=1900;y--){let o=document.createElement('option');o.value=y;o.textContent=y;if(y===2000)o.selected=true;s.appendChild(o)}}); }
  function showView(view){listView.hidden=view!=='list';addView.hidden=view!=='add';$('#pageTitle').textContent=view==='list'?'Danh sách Bệnh Nhân':'Thêm bệnh nhân mới';$('#breadcrumbText').textContent=view==='list'?'Bệnh Nhân':'Thêm Bệnh Nhân mới';$$('.submenu-item').forEach(b=>b.classList.toggle('selected',b.dataset.view===view));$('#openAdd').hidden=view==='add';if(view==='add')$('#pageForm [name=name]').focus();}
  function formData(form){let d=new FormData(form);return {name:String(d.get('name')||'').trim(),gender:d.get('gender'),birthYear:Number(d.get('birthYear')),address:String(d.get('address')||'').trim(),phone:String(d.get('phone')||'').trim(),identity:String(d.get('identity')||'').trim(),history:String(d.get('history')||'').trim()};}
  function addFrom(form, closeModal){let p=formData(form), err=$('.error',form);err.textContent='';if(!p.name||!p.address||!p.birthYear){err.textContent='Vui lòng điền đầy đủ Họ & Tên, Năm sinh và Địa chỉ.';return;}if(p.phone&&!/^[0-9+\s().-]{8,15}$/.test(p.phone)){err.textContent='Số điện thoại chưa hợp lệ. Hãy kiểm tra lại.';return;}if(p.identity&&patients.some(x=>x.identity===p.identity)){err.textContent='Số CCCD/CMND này đã tồn tại.';return;}let n=patients.reduce((m,x)=>Math.max(m,Number(String(x.id).replace(/\D/g,''))||0),0)+1;p.id='BN'+String(n).padStart(4,'0');p.createdAt=Date.now();patients.push(p);save();page=1;form.reset();years();render();if(closeModal)close();showView('list');toast('Đã thêm hồ sơ '+p.id+' thành công.');}
  function filtered(){let q=$('#search').value.trim().toLocaleLowerCase('vi'),g=$('#genderFilter').value,from=Number($('#yearFrom').value)||0,to=Number($('#yearTo').value)||9999,mode=$('#sort').value;let a=patients.filter(p=>[p.id,p.name,p.phone,p.identity,p.history,p.address].join(' ').toLocaleLowerCase('vi').includes(q)&&(g==='all'||p.gender===g)&&p.birthYear>=from&&p.birthYear<=to);a.sort((x,y)=>{if(mode==='nameAsc')return x.name.localeCompare(y.name,'vi');if(mode==='nameDesc')return y.name.localeCompare(x.name,'vi');if(mode==='birthAsc')return x.birthYear-y.birthYear;if(mode==='birthDesc')return y.birthYear-x.birthYear;if(sortKey==='id')return x.id.localeCompare(y.id)*sortDir;if(sortKey==='name')return x.name.localeCompare(y.name,'vi')*sortDir;if(sortKey==='phone')return x.phone.localeCompare(y.phone)*sortDir;if(sortKey==='history')return x.history.localeCompare(y.history,'vi')*sortDir;return (y.createdAt||0)-(x.createdAt||0)});return a;}
  function render(){let a=filtered(),size=Number($('#pageSize').value),total=a.length,pages=Math.ceil(total/size);if(pages&&page>pages)page=pages;if(page<1)page=1;let start=(page-1)*size,shown=a.slice(start,start+size);$('#countText').textContent=`Hiển thị ${shown.length} / ${total} hồ sơ`;
    $('#range').textContent=`Dòng đang xem: ${total?start+1:0}-${Math.min(start+shown.length,total)}`;$('#pageNo').textContent=`${total?page:0} / ${pages}`;$('#prev').disabled=page<=1||!total;$('#next').disabled=page>=pages||!total;
    rows.innerHTML=shown.map(p=>`<tr><td><strong>${esc(p.id)}</strong></td><td><div class="patient-name">${esc(p.name)}</div><div class="patient-sub">${esc(p.gender)} · ${esc(p.birthYear)}</div></td><td class="contact-line">${p.phone?'☎ '+esc(p.phone):'—'}<br><span class="patient-sub">${p.identity?'CCCD: '+esc(p.identity):esc(p.address)}</span></td><td class="history-text">${esc(p.history||'Chưa cập nhật')}</td><td class="action-cell"><button class="row-action" data-action="view" data-id="${esc(p.id)}" title="Xem hồ sơ">⌕</button><button class="row-action" data-action="delete" data-id="${esc(p.id)}" title="Xóa hồ sơ">×</button></td></tr>`).join('');$('#empty').hidden=total>0;$('table').hidden=total===0;$('#emptyText').textContent=patients.length?'Không có bệnh nhân phù hợp với bộ lọc hiện tại.':'Chưa có hồ sơ bệnh nhân. Nhấn “Thêm Bệnh Nhân” để tạo hồ sơ đầu tiên.';}
  function open(){
    modal.hidden=false;
    document.body.style.overflow='hidden';
    $('#modalForm').reset();
    $('.error',$('#modalForm')).textContent='';
    years();
    // Dat focus sau khi hop thoai da hien thi.
    requestAnimationFrame(()=>$('#modalForm [name=name]').focus());
  }
  function close(){
    modal.hidden=true;
    document.body.style.overflow='';
    $$('.submenu-item').forEach(item=>item.classList.toggle('selected',item.dataset.view==='list'));
  }
  $$('.submenu-item').forEach(b=>b.addEventListener('click',()=>{
    if(b.dataset.view==='add'){
      // Muc Them benh nhan mo hop thoai nho tren trang danh sach, khong chuyen sang trang rieng.
      $$('.submenu-item').forEach(item=>item.classList.toggle('selected',item.dataset.view==='list'));
      open();
      return;
    }
    close();
    showView('list');
    render();
  }));
  $('#patientMenuToggle').addEventListener('click',()=>{let s=$('#patientSubmenu');s.hidden=!s.hidden;$('#patientMenuToggle').setAttribute('aria-expanded',String(!s.hidden));$('.chevron').textContent=s.hidden?'+':'−'});
  $('#openAdd').addEventListener('click',open);$('#closeModal').addEventListener('click',close);$('#cancelModal').addEventListener('click',close);modal.addEventListener('click',e=>{if(e.target===modal)close()});document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!modal.hidden)close()});$('#modalForm').addEventListener('submit',e=>{e.preventDefault();addFrom(e.currentTarget,true)});$('#pageForm').addEventListener('submit',e=>{e.preventDefault();addFrom(e.currentTarget,false)});$('#cancelPage').addEventListener('click',()=>showView('list'));$('#closeAddPage').addEventListener('click',()=>showView('list'));
  $('#search').addEventListener('input',()=>{page=1;render()});$('#sort').addEventListener('change',()=>{page=1;render()});$('#pageSize').addEventListener('change',()=>{page=1;render()});$('#filterToggle').addEventListener('click',()=>$('#filterPanel').hidden=!$('#filterPanel').hidden);$('#applyFilter').addEventListener('click',()=>{page=1;render()});$('#clearFilter').addEventListener('click',()=>{$('#genderFilter').value='all';$('#yearFrom').value='';$('#yearTo').value='';$('#search').value='';page=1;render()});$('#prev').addEventListener('click',()=>{page--;render()});$('#next').addEventListener('click',()=>{page++;render()});
  $$('.sort-arrow').forEach(b=>b.addEventListener('click',()=>{let k=b.dataset.sort;if(sortKey===k)sortDir*=-1;else{sortKey=k;sortDir=1}$('#sort').value='new';render()}));rows.addEventListener('click',e=>{let b=e.target.closest('[data-action]');if(!b)return;let p=patients.find(x=>x.id===b.dataset.id);if(!p)return;if(b.dataset.action==='view')alert(`HỒ SƠ BỆNH NHÂN: ${p.id}\n\nHọ tên: ${p.name}\nGiới tính: ${p.gender}\nNăm sinh: ${p.birthYear}\nĐịa chỉ: ${p.address}\nĐiện thoại: ${p.phone||'Chưa cập nhật'}\nCCCD/CMND: ${p.identity||'Chưa cập nhật'}\nTiền căn: ${p.history||'Chưa cập nhật'}`);else if(confirm(`Bạn có chắc muốn xóa hồ sơ ${p.id} - ${p.name}?`)){patients=patients.filter(x=>x.id!==p.id);save();render();toast('Đã xóa hồ sơ bệnh nhân.')}});
  years();render();showView('list');
})();
