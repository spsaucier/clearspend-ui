function copy(name: string): void {
  const input = document.createElement('input');
  input.style.position = 'fixed';
  input.style.left = '-9999px';
  input.value = name;
  document.body.appendChild(input);
  input.focus();
  input.select();
  document.execCommand('copy');
  input.remove();
}

export const clipboard = { copy };
