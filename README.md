# Meteor Slingshot Example

Instructions on setting up an IAM user with correct S3 permissions for meteor-slingshot-example


1. Navigate to IAM home https://console.aws.amazon.com/iam/home
2. Navigate to Users -> Create New Users
  a. Specify username
  b. Make sure generate access key is checked
  c. Show user security credentials and add to settings.json as AWSAccessKeyId and AWSSecretAccessKey
3. Navigate to Policies -> Create New Policy
  a. Select “Create Your Own Policy”
  b. Give it a name, description
  c. Paste the text from this gist: https://gist.github.com/quackware/1c0fce89601fbadc7655 into “Policy Document” making sure to replace <bucketname> (2 occurences) with the name of your bucket you will create in step 4)
  d. Select your newly created policy (you may need to filter for it) and choose “Policy Actions” -> “Attach” and attach your user you created in step 2)
4. Navigate to s3 home https://console.aws.amazon.com/s3/home
  a. Create a bucket with a name (which you used in step 3) and select “US Standard” Region
    i. Note that the region can be different, but requires additional setup with slingshot to work
  b. Select the bucket and then click the “Properties” tab in the top right
  c. Click “Permissions” to open the dropdown
    i. Click “Edit CORS configuration” and paste in the following cors config: https://gist.github.com/quackware/dee3331c6436c07e84c2
    ii. Click “Edit Bucket policy” and paste in the following bucket policy: https://gist.github.com/quackware/141e1cc8e8c0f4e9adb7 making sure to replace <awsaccountid> with your account id (found in Account Settings), <iamusername> with your iam user in part 2), and <bucketname> you created above
  d. Add your bucket name to settings.json using the “S3Bucket” key
5. You should be good to go!
