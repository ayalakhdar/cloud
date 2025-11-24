export function saveAuth(data){
  localStorage.setItem('auth', JSON.stringify(data));
}
export function loadAuth(){
  const s = localStorage.getItem('auth'); return s ? JSON.parse(s) : null;
}
export function clearAuth(){ localStorage.removeItem('auth'); }
