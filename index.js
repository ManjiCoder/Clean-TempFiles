console.log('Jai Shree Ram');
const path = require('path');
const fs = require('fs');
const os = require('os');

/***************************************************
 * Step 1: Get Data => totalFiles, totalSize & filePathArr
 * Step 2: Deletion of filePathArr
 ***************************************************/
const getData = (dirPath, data) => {
  fs.readdirSync(dirPath).forEach((file) => {
    const pwd = path.join(dirPath, file);
    const pwdInfo = fs.statSync(pwd);
    if (pwdInfo.isDirectory()) {
      getData(pwd, data);
    } else {
      data.size += pwdInfo.size;
      data.files += 1;
      data.filePathArr.push(pwd);
    }
  });

  return data;
};
const main = () => {
  const t1 = performance.now();
  const dirArr = [os.tmpdir()];
  if (os.platform() === 'win32') {
    dirArr.push('C:\\Windows\\Temp');
  }
  const data = {
    files: 0,
    size: 0,
    filePathArr: [],
    deletedFiles: 0,
  };
  dirArr.forEach((dirPath) => {
    getData(dirPath, data);
  });

  console.log('Cleaning Start');
  data.filePathArr.forEach((filePath) => {
    try {
      fs.unlinkSync(filePath);
      data.deletedFiles += 1;
    } catch (error) {
      //   console.log(`${error.code}: ${filePath}`);
    }
  });
  const t2 = performance.now();
  const time = parseFloat(((t2 - t1) / 1000).toFixed());

  console.log(
    `
Total Files: ${data.files}
Total Size: ${(data.size / (1024 * 1024)).toFixed()} MB
Total Deleted Files: ${data.deletedFiles}
Total Time: ${time} sec
    `
  );
  console.log('Cleaning Done');
  return data;
};

main();
