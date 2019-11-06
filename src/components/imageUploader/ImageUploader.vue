<template>
  <div class="m-image-uploader f-flex">
    <div class="preview f-flex-fixed" v-show="previewSrc" v-loading="uploading">
      <i class="u-image auto" :style="{ width: imageWidth, height: imageHeight, lineHeight: imageHeight }"><img :src="previewSrc" alt="预览图"></i>
    </div>
    <div class="uploader-control f-flex-auto f-flex" v-if="showBtn">
      <div>
        <div size="small" class="u-file-btn" @click="handleChoose">
        <slot name="point">
          <p class="help-block" v-text="point" v-if="point"></p>
        </slot>
          <span v-text="previewSrc ? '重新上传' : '选择文件'"></span>
          <input type="file" ref="fileInput" name="file" :accept="accept" @change="handleChangeFile" class="file">
        </div>
        <slot name="tips">
          <p class="help-block" v-text="tips" v-if="tips"></p>
        </slot>
      </div>
    </div>
    <div class="mask" v-if="nowImg" @click.stop="hiddenMask">
      <!--<img :src="nowImg"/>-->
      <vue-photo-zoom-pro type="circle" width="250" :url="nowImg"></vue-photo-zoom-pro>
    </div>
  </div>
</template>

<script>
import ImageUploader from './imageUploader'
export default ImageUploader
</script>

<style lang="less" scoped>
.m-image-uploader {
  display: flex;
  align-items: center;
  .preview {
    margin-right: 20px;

    & > i {
      display: inline-block;
      border: solid 1px #e2e3e5;
      border-radius: 2px;

      & > img {
        object-fit: cover;
        vertical-align: middle;
        width: 100%;
        height: 100%;
        position: relative;
        top: -1px;
      }
    }
  }

  .uploader-control {
    align-items: center;
  }
  .u-file-btn{
    display: flex;
    align-items: center;
    position: relative;
    cursor: pointer;
/*    .file{
      opacity: 0;
      position: absolute;
      left: 0;
      right: 0;
      width: 0;
      height: 0;
      z-index: 2;
    }*/
  }

  .help-block {
    margin: 5px 0;
    font-size: 12px;
    color: #bcbcbc;
  }
}
.mask{
  position: fixed;
  top: 0;
  right: 0;
  z-index: 999;
  width: 50%;
  height: 100%;
  background-color: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content:  center;
  img{
    max-width: 90%;
    max-height: 90%;
  }
}
</style>
