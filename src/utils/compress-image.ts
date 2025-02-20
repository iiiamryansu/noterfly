import 'client-only'
import imageCompression from 'browser-image-compression'

/**
 * 参考文档
 * https://github.com/Donaldcwl/browser-image-compression
 */
const options = {
  maxSizeMB: 1,
  useWebWorker: true,
}

/**
 * 压缩图片文件
 * @param {File} image - 要压缩的图片文件
 * @param {number} [maxWidthOrHeight=1200] - 最大宽度或高度, 保持原始宽高比
 * @returns {Promise<File>} 压缩后的图片文件
 */
export async function compressImage(image: File, maxWidthOrHeight = 1200): Promise<File> {
  return new File([await imageCompression(image, { ...options, maxWidthOrHeight })], image.name)
}
