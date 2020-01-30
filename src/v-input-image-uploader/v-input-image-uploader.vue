<template>
	<div>
		<slot></slot>
		<input ref="inputSelectImage" type="file" accept="image/*" v-show="false" value="fileSelectValues" :multiple="multiple" @change="handleSelectImage">
	</div>
</template>

<script>
import compressor from 'v-image-compressor';
import { request } from 'v-utility';

async function uploadImage() {
  this.$emit('beginUpload');
  let result = await Promise.all(this.imageList.map(image => {
    return new Promise((resolve, reject) => {
      if (image.startsWith('data:image/jpeg;base64,')) {
        let image64 = image.substr(image.indexOf(',') + 1);
        request.post({
          url: this.uploadUrl,
          parameter: {
            subfolder: this.uploadSubfolder,
            returnImageSize: 'true',
            filename: this.uploadFileName + '.jpg',
            h5data: image64
          },
          returnType: 'json',
          onSuccess: (returnJson) => {
            resolve(returnJson.Url);
          },
          onFail: (error) => {
            reject({
              message: error.type
            });
          }
        });
      }
      else {
        resolve(image);
      }
    });
  }));
  this.$emit('input', result);
  this.$emit('endUpload', result);
  return result;
}

export default {
	name: 'v-input-image-uploader',
	data() {
		return {
			fileSelectValues: null,
			imageList: []
		};
	},
	props: {
    value: {
      type: Array,
      default: []
    },
		qualityRatio: {
			type: Number,
			default: 0.5
		},
		uploadUrl: {
			type: String,
			default: ''
		},
		uploadSubfolder: {
			type: String,
			default: 'avatar'
		},
		uploadFileName: {
			type: String,
			default: 0
		},
    multiple: {
      type: Boolean,
      default: false
    },
    autoUpload: {
      type: Boolean,
      default: false
    },
    maxImageCount: {
      type: Number,
      default: 100
    }
	},
  mounted() {
    if (this.maxImageCount < 0) {
      throw new Error('maxImageCount must be more than zero!');
    }
    this.imageList = this.value || [];
  },
  activated() {
    this.imageList = this.value || [];
  },
  watch: {
    value: {
      handler: function (newValue) {
        this.imageList = newValue || [];
      },
      deep: true
    }
  },
	methods: {
		select() {
			let evt = document.createEvent('MouseEvents');
			evt.initEvent('click', true, true);
			this.$refs.inputSelectImage.dispatchEvent(evt);
		},
		handleSelectImage(event) {
      let fileList = event.target.files;
      if (fileList.length > this.maxImageCount) {
        fileList = [...fileList].splice(0, this.maxImageCount);
      }
      this.fileSelectValues = null;
			compressor.compress({
				imageList: fileList,
				ratio: this.qualityRatio
			}).then((result) => {
        let arr = [...this.imageList, ...(result.map(elem => elem.resultImageData))];
        if (arr.length > this.maxImageCount) {
          //后选择的图片覆盖掉先选择的图片
          arr.splice(0, arr.length - this.maxImageCount);
        }
        this.imageList = arr;
        this.$emit('input', this.imageList);
        this.$emit('endCompress', this.imageList);
        if (this.autoUpload) {
          return uploadImage.call(this);
        }
			}).catch(error => {
				this.$emit('error', error);
			});
			this.$emit('beginCompress');
		},
    upload() {
      uploadImage.call(this).catch(error => {
				this.$emit('error', error);
      });
    }
	}
};
</script>

<style scoped>

</style>
