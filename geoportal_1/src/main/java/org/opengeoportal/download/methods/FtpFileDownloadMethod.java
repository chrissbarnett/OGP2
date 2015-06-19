package org.opengeoportal.download.methods;

import java.net.MalformedURLException;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.opengeoportal.download.types.LayerRequest;

import com.fasterxml.jackson.core.JsonParseException;

public class FtpFileDownloadMethod extends AbstractFtpDownloadMethod implements PerLayerDownloadMethod {	
	private static final Boolean INCLUDES_METADATA = false;
	
	@Override
	public Boolean includesMetadata() {
		return INCLUDES_METADATA;
	}

	
	@Override
	public Set<String> getExpectedContentType(){
		Set<String> expectedContentType = new HashSet<String>();
		expectedContentType.add("application/zip");
		return expectedContentType;
	}
	
	@Override
	public Boolean expectedContentTypeMatched(String foundContentType){
		//a file download could be anything
		return true;
	}
	
	@Override
	public String createDownloadRequest() throws Exception {
				return "";
	}

	@Override
	public List<String> getUrls(LayerRequest layer) throws MalformedURLException, JsonParseException{
		List<String> urls = layer.getDownloadUrl();
		for (String currentUrl: urls){
			logger.debug("download url:" + currentUrl);
			this.checkUrl(currentUrl);
		}
		return urls;
	}
}
