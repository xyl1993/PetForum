package actical.service;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Param;

import actical.model.ActicalModel;
import actical.model.InfoModel;
import actical.model.KeepModel;
import actical.model.PlModel;
import actical.model.SearchModel;

public interface ActicalService {

	public Map<String,Object> save(ActicalModel model,String token);
	
	public Map<String,Object> getActList(int pageIndex,int pageSize,SearchModel searchModel);
	
	public Map<String,Object> getActDetail(Map<String,Object> paramsMap);
	
	public Map<String,Object> getMyKeepAct(int pageIndex,int pageSize,String userId);
	
	public Map<String,Object>getplList(int pageIndex,int pageSize,int invitation_id);
	
	public Map<String,Object> findHasById(int id);
	
	public Map<String,Object> saveReplay(PlModel model,String token);
	
	public Map<String,Object> delAct(int id,String token);
	
	public Map<String,Object> getHotActList();
	
	public Map<String,Object> getNewActList();
	
	/**
	 * 获取我参与的文章
	 * @return
	 */
	public Map<String,Object> getMyActList(int pageIndex,int pageSize,SearchModel searchModel,String token);
	
	public Map<String,Object> getMySendActList(int pageIndex,int pageSize,SearchModel searchModel,String token);
	
	public Map<String,Object> delReplay(int replayId,String token);
	
	public Map<String,Object> getInfoList(int pageIndex,int pageSize,InfoModel infoModel,String token);
	
	public Map<String,Object> readInfo(int id);
	
	public Map<String,Object> delInfo(int id);
	
	public Map<String,Object> getTag();
	
	public Map<String,Object> inKeep(KeepModel keepModel,String token);
	
	public Map<String,Object> isKeep(KeepModel keepModel,String token);
	
	public Map<String,Object> cancleKeep(KeepModel keepModel,String token);
	
	public Map<String,Object> getInfoNotRead(String token);
	
}
