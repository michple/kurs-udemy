import throttle from 'loadsh/throttle'
import debounce from 'loadsh/debounce'


class RevealOnScroll {
    constructor(els, thresholdPercent) {
        this.thresholdPercent = thresholdPercent;
        this.itemsToReveal = els;
        this.browserHeight = window.innerHeight;
        this.hideInitialy();
        this.scrollThrottle = throttle(this.calcCaller, 200).bind(this);
        this.events();

    }

    events() {
        window.addEventListener("scroll", this.scrollThrottle);
        window.addEventListener("resize", debounce(() => {
            console.log("dasdsa");
            this.browserHeight = window.innerHeight;
        }, 333))
    }
    calcCaller() {
        console.log("asdsa");
        this.itemsToReveal.forEach(el => {
            if (el.isRevealed == false) {
                this.calculateIfScrolledTo(el);
            }
        });
    }
    calculateIfScrolledTo(el) {
        if (window.scrollY + this.browserHeight > el.offsetTop) {
            console.log("widac");
            let scrollPercent = (el.getBoundingClientRect().y / this.browserHeight) * 100;
            if (scrollPercent < this.thresholdPercent) {
                el.classList.add("reveal-item--is-visible");
                el.isRevealed = true;
                if (el.isLastItem) {
                    window.removeEventListener("scroll", this.scrollThrottle);
                }
            }
        }

    }
    hideInitialy() {
        this.itemsToReveal.forEach(el => {
            el.classList.add("reveal-item");
            el.isRevealed = false;
        });
        this.itemsToReveal[this.itemsToReveal.length - 1].isLastItem = true;
    }

}
export default RevealOnScroll;