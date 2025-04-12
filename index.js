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
      const isEmptyDir = fs.readdirSync(pwd).length === 0;
      if (isEmptyDir) {
        fs.rmSync(pwd, { recursive: true, force: true });
      }
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
    const isEmptyDir = fs.readdirSync('C:\\Windows\\Temp').length === 0;
    if (!isEmptyDir) {
      dirArr.push('C:\\Windows\\Temp');
    }
  }
  const data = {
    files: 0,
    size: 0,
    filePathArr: [],
    deletedFiles: 0,
    failedToRemoveFiles: 0,
  };
  dirArr.forEach((dirPath) => {
    getData(dirPath, data);
  });

  console.log('Cleaning Start');
  data.filePathArr.forEach((filePath) => {
    try {
      fs.rmSync(filePath, { recursive: true, force: true });
      data.deletedFiles += 1;
    } catch (error) {
      failedToRemoveFiles += 1;
      //   console.log(`${error.code}: ${filePath}`);
    }
  });
  const t2 = performance.now();
  const time = parseFloat(((t2 - t1) / 1000).toFixed());

  const msg = `
Total Files: ${data.files}
Total Size: ${(data.size / (1024 * 1024)).toFixed()} MB
Total Deleted Files: ${data.deletedFiles}
Total Failed To Remove Files: ${data.failedToRemoveFiles}
Total Time: ${time} sec
    `;

  console.log(msg);

  console.log('Cleaning Done');
  setTimeout(() => {
    console.log('Done');
  }, 10000);
  return data;
};

main();
