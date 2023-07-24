
document.querySelector('button').addEventListener('click', async () => {
  const res = await fetch('http://localhost:3000/api/users').then(res => res.json());

  console.log(res);

  document.querySelector('div').textContent = JSON.stringify(res, undefined, 2);
})
