const aws = require('aws-sdk')
const uploadtos3 = ((data, filename) => {
  const BUCKET_NAME = ''
  const IAM_USER_KEY = ''
  const IAM_USER_SECRET = ''

  let s3bucket = new aws.S3({
      accessKeyId: IAM_USER_KEY,
      secretAccessKey: IAM_USER_SECRET
  })

      var params = {
          Bucket: BUCKET_NAME,
          Key: filename,
          Body: data,
          ACL: 'public-read'
      }
      return new Promise((resolve, reject) => {
          s3bucket.upload(params, (err, s3response) => {
              if(err)
              {
                  console.log('Something Went Wrong', err)
                  reject(err)
              }
              else
              {
                  console.log('Successfull')
                  resolve(s3response.Location) 
              }
          })
      })
      
  })

  module.exports = uploadtos3;