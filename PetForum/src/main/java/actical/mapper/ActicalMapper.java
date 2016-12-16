package actical.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Param;

import actical.model.ActicalModel;
import actical.model.InfoModel;
import actical.model.KeepModel;
import actical.model.PlModel;
import actical.model.TagModel;

public interface ActicalMapper {
	public void save(ActicalModel model);
	
	public List<ActicalModel> getActList(Map<String,Object> paramsMap);
	
	public List<ActicalModel> getMyKeepAct(Map<String,Object> paramsMap);
	
	public List<ActicalModel> getActDetail(Map<String,Object> paramsMap);
	
	public int getActListCount(Map<String,Object> paramsMap);
	
	public int getKeepCount(Map<String,Object> paramsMap);
	
	public int findHasById(int id);
	
	//判断文章是否为本人发布。避免恶意删除
	public int isTrueSend(@Param("token")String token,@Param("id")int id);
	//判断评论是否为本人发布。避免恶意删除
	public int isTrueReplay(@Param("token")String token,@Param("id")int id);
	
	public List<PlModel>getplList(@Param("rowNum") int rowNum,@Param("pageSize") int pageSize,@Param("invitation_id") int invitation_id);
	
	public List<ActicalModel> getMyActList(Map<String,Object> paramsMap);
	
	public int register(PlModel model);
	
	public int saveReplay(PlModel model);
	
	public int getReplyCount(int value);
	
	public void delAct(int id);
	
	public void delReplay(int invitation_id);
	
	public void delReplayByReplayId(int id);
	
	public List<ActicalModel> getHotActList();
	
	public List<ActicalModel> getNewActList();
	
	//保存信息表
	public void saveInfo(PlModel model);
	
	public List<InfoModel> getInfoList(Map<String,Object> paramsMap);
	
	public void readInfo(int id);
	
	public void delInfo(int id);
	
	public void inKeep(KeepModel keepModel);
	
	public int isKeep(KeepModel keepModel);
	
	public void cancleKeep(KeepModel keepModel);
	
	public List<TagModel> getTag();
	
	public int getInfoNotRead(String token);
}
