import { Plugin } from 'obsidian';
function iu(prefix, word, suffix) {
    const combinedString = prefix + word + suffix;
    const urlRegex = /https?:\/\/[^\s]+/g;

    let match;
    while ((match = urlRegex.exec(combinedString)) !== null) {
        const url = match[0];
        const urlStartIndex = match.index;
        const urlEndIndex = urlStartIndex + url.length;

        // check word index
        const wordStartIndex = prefix.length;
        const wordEndIndex = prefix.length + word.length;

        if (wordStartIndex >= urlStartIndex && wordEndIndex <= urlEndIndex) {
            return true; // word in URL
        }
    }
	if(prefix?.replace(/\[.*?\]/g, '').includes('[')) // word in link
		return true;
	if(suffix?.replace(/\[\[.*?\]\]/g, '').replace(/\[.*?\]/g, '').includes(']'))
		return true;

    return false; // word not in URL nor link
}

export default class extends Plugin {
	onload() {
		this.interval = setInterval(() =>document.querySelectorAll('.backlink-pane').forEach(p=>{
			p.children[3].querySelectorAll('.search-result-file-match').forEach(m=>{
				let a=m.querySelector('.search-result-file-matched-text');//alias
				if(iu(a.previousSibling?.innerHTML,a.innerText,a.nextSibling?.innerText))
					m.style.backgroundColor = 'rgba(255, 0, 0, 0.1)';
			})
			if(p.children[2].childElementCount<4){
				let b=document.createElement('button');
				b.classList.add('link-all');
				b.textContent = 'Link all';
				console.log('ck');
				b.addEventListener('click', e=>{
					e.stopPropagation();
					p.children[3].querySelectorAll('.search-result-file-match').forEach(m=>{
						let a=m.querySelector('.search-result-file-matched-text');
						if(!iu(a.previousSibling?.innerHTML,a.innerText,a.nextSibling?.innerText))
							m.querySelector('.search-result-file-match-replace-button').click();
					})
				},{capture: true});
				p.children[2].appendChild(b);
			}
		}),500);
	}
	onunload() {
		clearInterval(this.interval);
	}
};
