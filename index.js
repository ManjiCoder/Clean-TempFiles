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
const main = (dirArr) => {
  const data = {
    files: 0,
    size: 0,
    filePathArr: [],
  };
  dirArr.forEach((dirPath) => {
    getData(dirPath, data);
  });
  
  console.log(
    `Total Files: ${data.files}\nTotal Size: ${(
      data.size /
      (1024 * 1024)
    ).toFixed()} MB`
  );
  console.log('Cleaning Start');
  data.filePathArr.forEach((filePath) => {
    try {
      fs.unlinkSync(filePath);
    } catch (error) {
      //   console.log(`${error.code}: ${filePath}`);
    }
  });
  console.log('Cleaning Done');

  return data;
};

main([os.tmpdir()]);
