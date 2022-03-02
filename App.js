import { View, Text, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import DocumentPicker from 'react-native-document-picker';
import RNFetchBlob from 'rn-fetch-blob';
import Share from 'react-native-share';

export default function App() {
const [fileBase64String,setFileBase64String]=useState("")

  const openDocumentFile=async ()=>{
    try{
      const res= await DocumentPicker.pick({
        type:[DocumentPicker.types.allFiles]
      });
      console.log(res)
      const fileName= res[0].uri.replace("file://","")
      let data= ""
      RNFetchBlob.fs.readStream(
        fileName,
        "base64",
      ).then((ifStream)=>{
        ifStream.open()
        ifStream.onData((data)=>{
          // console.log("check data ifstream ==>", data);
          let base64=`data:${res[0].type};base64,`+data
          setFileBase64String(base64.toString())

        })
      })
    }

    catch(err){
      if(DocumentPicker.isCancel(err)){
        console.log("iscancel",err)
      }else{
        throw err;
        
      }
    }
  }

 // Share to social media.................
// console.log("basesss",fileBase64String)
const onShare=async()=>{
  const shareOptions={
    message:'This is a test message.',
     url:fileBase64String,
  }

  try {
    const ShareResponse = await Share.open(shareOptions);
    console.log(JSON.stringify(ShareResponse));
  } catch(error) {
    console.log('Error => ', error);
  }

}

  return (
    <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
      <TouchableOpacity
      onPress={()=>openDocumentFile()}
       style={{padding:10, width:'80%', alignItems:'center', backgroundColor:"#67756b", borderRadius:10}}
      
      >
     <Text style={{color:'white'}}>Open Documents</Text>
        </TouchableOpacity>

        <TouchableOpacity
        onPress={onShare}
         style={{padding:10,marginVertical:10, width:'80%', alignItems:'center', backgroundColor:"#8a6986", borderRadius:10}}
        >
          <Text style={{color:'white'}}>Share with your Friend</Text>
        </TouchableOpacity>
    </View>
  )
}