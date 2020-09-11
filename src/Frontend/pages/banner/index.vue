<template>
  <div>
    <h1>dbots banner maker</h1>
    <main>
      <section>
        <div class="button-bar">
          <button class="button" @click.prevent="reset">Reset</button>
          <button class="button" @click.prevent="undo">Undo</button>
          <button class="button" @click.prevent="redo">Redo</button>
          <button class="button" @click.prevent="preview">Preview</button>
        </div>
        <input ref="input" type="file" @change="addImage">
      </section>
      <div class="workspace">
        <canvas
          ref="canvas"
          width="1280"
          height="720"
          class="canvas"
          @mousedown.prevent.stop="handleClick"
          @mouseup.prevent.stop="handleUnclick"
          @mousemove.prevent.stop="handleMove"
          @mouseout.prevent.stop="handleOut"
        />
      </div>
      <div class="hidden">
        <img ref="overlay" class="overlay" src="/img/banner-overlay.png">
      </div>
    </main>

  </div>
</template>

<script>
const shift = {
  CAP: 'cap',
  CHOOSE: 'choose',
  IGNORE: 'ignore'
};
const transforms = {
  image: { x: 1, y: 1, width: 0, height: 0, shift: shift.CHOOSE },
  topLeft: { x: 1, y: 1, width: -1, height: -1, shift: shift.CAP },
  topRight: { x: 0, y: 1, width: 1, height: -1, shift: shift.CAP },
  bottomLeft: { x: 1, y: 0, width: -1, height: 1, shift: shift.CAP },
  bottomRight: { x: 0, y: 0, width: 1, height: 1, shift: shift.CAP },
  middleLeft: { x: 1, y: 0, width: -1, height: 0, shift: shift.IGNORE },
  middleRight: { x: 0, y: 0, width: 1, height: 0, shift: shift.IGNORE },
  middleTop: { x: 0, y: 1, width: 0, height: -1, shift: shift.IGNORE },
  middleBottom: { x: 0, y: 0, width: 0, height: 1, shift: shift.IGNORE }
};

export default {
  data() {
    return {
      ctx: null,
      images: [],
      startX: null,
      startY: null,
      offsetX: null,
      offsetY: null,
      isDragging: 0,
      currentImage: null,
      currentKey: null,
      canDrag: true,
      mx: null,
      my: null,
      dx: null,
      dy: null,
      history: [],
      rehistory: []
    };
  },
  computed: {
  },
  mounted() {
    this.ctx = this.$refs.canvas.getContext('2d');
    const bb = this.$refs.canvas.getBoundingClientRect();
    this.offsetX = bb.left;
    this.offsetY = bb.top;

    this.reset();
  },
  methods: {
    reset() {
      this.images = [];
      this.history = [];
      this.rehistory = [];
      this.draw();
    },
    addImage(evt) {
      const input = this.$refs.input;
      if (!input.files || !input.files[0]) return;

      const FR = new FileReader();
      FR.addEventListener("load", (evt) => {
        const img = new Image();
        img.addEventListener("load", () => {
          console.log({img});
          const dim = {x: 0, y: 0, width: img.naturalWidth, height: img.naturalHeight};
          this.images.push({
            img, start: {...dim}, dim
          });
          this.draw();
        });
        img.src = evt.target.result;
      });
      FR.readAsDataURL(input.files[0]);
    },
    draw(handles = 1) {
      const ctx = this.ctx;

      ctx.beginPath();
      ctx.rect(0, 0, 1280, 720);
      ctx.fillStyle = 'white';
      ctx.fill();

      for (const image of this.images) {
        ctx.drawImage(image.img, image.dim.x, image.dim.y, image.dim.width, image.dim.height);

        if (handles) {
          this.drawHandles(image);
        }
      }

      ctx.drawImage(this.$refs.overlay, 0, 0);
    },
    drawLine(x1, y1, x2, y2, color = "red") {
      this.ctx.beginPath();
      this.ctx.lineWidth = 1;
      this.ctx.strokeStyle = color;
      this.ctx.moveTo(x1, y1);
      this.ctx.lineTo(x2, y2);
      this.ctx.stroke();
    },
    drawHandle(x, y, d = 8, color = 'red') {
      const r = d / 2;
      this.ctx.beginPath();
      let x1 = x - r;
      let y1 = y - r;
      let x2 = x1 + d;
      let y2 = y1 + d;
      this.ctx.rect(x1, y1, d, d);
      this.ctx.fillStyle = color;
      this.ctx.fill();

      return { x1, y1, x2, y2 };
    },
    drawBox(x, y, w, h, color) {
      this.drawLine(x, y, x + w, y, color);
      this.drawLine(x + w, y, x + w, y + h, color);
      this.drawLine(x + w, y + h, x, y + h, color);
      this.drawLine(x, y + h, x, y, color);
    },
    drawHandles(image) {
      if (!this.canDrag) return;

      const { x, y, width, height } = image.dim;
      this.drawBox(x, y, width, height);

      const bounds = {};
      bounds.image = { x1: x, y1: y, x2: x + width, y2: y + height };

      bounds.topLeft = this.drawHandle(x, y);
      bounds.topRight = this.drawHandle(x + width, y);
      bounds.bottomRight = this.drawHandle(x + width, y + height);
      bounds.bottomLeft = this.drawHandle(x, y + height);

      let x2 = x + width / 2;
      let y2 = y + height / 2;

      bounds.middleTop = this.drawHandle(x2, y);
      bounds.middleLeft = this.drawHandle(x, y2);
      bounds.middleBottom = this.drawHandle(x2, y + height);
      bounds.middleRight = this.drawHandle(x + width, y2);

      image.bounds = bounds;
    },

    areCoordsInBounds(x, y, b) {
      return x >= b.x1 && x <= b.x2 && y >= b.y1 && y <= b.y2;
    },

    findImage(x, y) {
      let out = {};
      for (const image of this.images) {
        if (image.bounds) {
          for (const key of Object.keys(image.bounds)) {
            const b = image.bounds[key];
            if (this.areCoordsInBounds(x, y, b)) {
              out = { image, key };
            }
          }
        }
      }
      return out;
    },

    handleClick(e) {
      if (!this.canDrag) return;

      this.startX = parseInt(e.clientX - this.$refs.canvas.getBoundingClientRect().left);
      this.startY = parseInt(e.clientY - this.$refs.canvas.getBoundingClientRect().top);

      console.log(this.startX, this.startY);

      const { image, key } = this.findImage(this.startX, this.startY);
      console.log({image, key});
      this.currentImage = image;
      this.currentKey = key;

      if (this.currentImage) {
        this.isDragging = 1;
      }
    },
    handleUnclick() {
      if (!this.isDragging) return;

      this.history.unshift({image: this.currentImage, dim: {...this.currentImage.start}});
      if (this.history.length > 20) {
        this.history.pop();
      }
      this.rehistory = [];

      this.currentImage.start = {...this.currentImage.dim};

      this.isDragging = false;
    },
    handleMove(e) {
      if (!this.isDragging) return;
      console.log(e);

      this.mx = parseInt(e.clientX - this.$refs.canvas.getBoundingClientRect().left);
      this.my = parseInt(e.clientY - this.$refs.canvas.getBoundingClientRect().top);

      this.dx = this.mx - this.startX;
      this.dy = this.my - this.startY;

      const transform = transforms[this.currentKey];

      if (e.shiftKey) {
        const adx = Math.abs(this.dx);
        const ady = Math.abs(this.dy);
        switch (transform.shift) {
          case shift.CAP: {
            if (adx < ady) {
              this.dy = Math.sign(this.dy) * adx * (this.currentImage.start.height / this.currentImage.start.width);
            } else {
              this.dx = Math.sign(this.dx) * ady * (this.currentImage.start.width / this.currentImage.start.height);
            }
            break;
          }
          case shift.CHOOSE: {
            if (adx > ady) {
              this.dy = 0;
            } else {
              this.dx = 0;
            }
          }
        }
      }


      this.currentImage.dim.x = this.currentImage.start.x + this.dx * transform.x;
      this.currentImage.dim.y = this.currentImage.start.y + this.dy * transform.y;
      this.currentImage.dim.width = this.currentImage.start.width + this.dx * transform.width;
      this.currentImage.dim.height = this.currentImage.start.height + this.dy * transform.height;

      console.log({mx: this.mx, my: this.my, dx: this.dx, dy: this.dy});

      this.draw();

      // this.startX = this.mx;
      // this.startY = this.my;
    },
    handleOut() {
      if (!this.isDragging) return;
    },
    undo() {
      const history = this.history.shift();
      if (history) {
        this.rehistory.unshift({ image: history.image, dim: {...history.image.start }});

        history.image.dim = {...history.dim};
        history.image.start = {...history.dim};
      }

      this.draw();
    },
    redo() {
      const history = this.rehistory.shift();
      if (history) {
        this.history.unshift({ image: history.image, dim: {...history.image.start }});

        history.image.dim = {...history.dim};
        history.image.start = {...history.dim};
      }

      this.draw();
    },
    preview() {
      this.canDrag = !this.canDrag;
      this.draw();
    }
  },
  head: {
    title: "dbots banner maker",
    link: [{ rel: "icon", type: "image/x-icon", href: "/img/thinkingBEE.png" }]
  }
};
</script>

<style lang="scss" scoped>
.workspace {
  margin: 20px auto;
  width: 1280px;
  height: 720px;
  position: relative;
}

.canvas {
  display: block;
}

.hidden {
  display: none;
}

.button-bar {
  display: flex;
}
</style>