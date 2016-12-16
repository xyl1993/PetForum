//调用 注册 文件    chat  
function RegExe(regPath){  
  //"HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Run\\FEIQ"
  var regEdit = new RegEdit();  
  var x = regEdit.regRead(regPath);  
    
  if(x == ""){  
     alert("请先下载安装analyseCookie.exe!");  
     return false;  
  }  
  var s = x.substring(x.indexOf('"')+1,x.lastIndexOf('"'));  
  Run(s);  
}  
    
 function Run(strPath){     
    try{     
      var objShell = new ActiveXObject("wscript.shell");     
        
      var fso = new ActiveXObject("Scripting.FileSystemObject");  
          
  	  f = fso.GetFile(strPath);  
     
      var s_path = f.ShortPath;  //改为短路径  
        
      objShell.Run(s_path);     
      objShell = null;     
    }catch(e){  
      alert(e.message);     
    }     
}     
   
  
////////////////注册表编辑类start//////////////////////  
/** 
 * 注册表编辑器，封装对注册表的操作 
 */  
function RegEdit(){  
 this.shell = new ActiveXObject("WScript.Shell");  
 this.regRead = regRead;  
 this.regWrite = regWrite;  
 this.regDelete = regDelete;  
}  
  
/** 返回名为 strName 的注册键或值。 
 * @param strName 要读取的键或值。如果 strName 以反斜线 (\) 结束，本方法将返回键，而不是值 
 * @return 名为 strName 的注册键或值 
 */  
function regRead(strName){  
 var val = null;  
 try {  
  val = this.shell.regRead(strName);  
 } catch (e) {  
  alert(e.message);  
 }  
 return val;  
}  
  
/** 设置 strName 指定的注册键或值 
 * @param strName 要写的键或值的名称.如果 strName 以反斜线 (\) 结束，本方法将返回键，而不是值 
 * @param anyValue 要写入键或注册表值中的值 
 * @param strType 可选项。要保存到注册表中的值的数据类型REG_SZ、REG_EXPAND_SZ、REG_DWORD、REG_BINARY 
 */  
function regWrite(strName,anyValue,strType){  
 if(strType == null)  
  strType = "REG_SZ";  
 this.shell.regWrite(strName,anyValue,strType);  
}  
  
/** 从注册表中删除 strName 指定的键或值。 
 * @param strName 要删除的键或值的名字。如果 strName 以反斜线 (\) 结束，本方法将删除键，而不是值 
 */  
function regDelete(strName){  
 this.shell.regDelete(strName);  
}  
////////////////注册表编辑类end//////////////////////  