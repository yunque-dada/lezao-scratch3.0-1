/**
 * Scratch编辑器组件
 * 基于 scratch3-master 封装
 */
import React, { useEffect, useRef, useState } from 'react';

const ScratchEditor = ({ 
  projectId, 
  projectUrl, 
  onSave, 
  onLoad,
  readOnly = false 
}) => {
  const containerRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 初始化Scratch
    const initScratch = async () => {
      try {
        setLoading(true);
        
        // 检查scratch是否已加载
        if (!window.scratch) {
          // 动态加载Scratch脚本
          await loadScratchScripts();
        }

        // 配置Scratch
        window.scratchConfig = {
          session: {
            token: localStorage.getItem('token') || '',
            username: '用户'
          },
          projectInfo: {
            projectName: '未命名作品',
            authorUsername: '用户'
          },
          menuBar: {
            style: {
              background: '#4D97FF'
            },
            newButton: {
              show: !readOnly
            },
            loadFileButton: {
              show: !readOnly
            },
            saveFileButton: {
              show: !readOnly
            },
            customButtons: [
              {
                show: true,
                buttonName: '保存作品',
                style: {
                  color: 'white',
                  background: '#FFAB19'
                },
                handleClick: async () => {
                  if (onSave) {
                    // 获取项目文件
                    window.scratch.getProjectFile((file) => {
                      // 获取作品截图
                      window.scratch.getProjectCover((cover) => {
                        const projectName = window.scratch.getProjectName();
                        onSave({
                          file,
                          cover,
                          projectName
                        });
                      });
                    });
                  }
                }
              }
            ]
          },
          blocks: {
            scale: 0.8
          },
          gui: {
            theme: 'scratch3'
          },
          handleProjectLoaded: () => {
            setLoading(false);
            if (onLoad) onLoad();
          }
        };

        // 初始化Scratch GUI
        if (window.scratch && window.scratch.gui) {
          // 如果有项目ID，加载项目
          if (projectId || projectUrl) {
            // 项目加载由外部处理
          }
          setLoading(false);
        }
      } catch (err) {
        console.error('Scratch初始化失败:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    initScratch();

    // 清理
    return () => {
      // 可以在这里添加清理逻辑
    };
  }, [projectId, projectUrl, readOnly]);

  // 动态加载Scratch脚本
  const loadScratchScripts = () => {
    return new Promise((resolve, reject) => {
      // 假设Scratch构建在 /scratch3 目录
      const baseUrl = '/scratch3';
      
      // 加载lib.min.js
      const libScript = document.createElement('script');
      libScript.src = `${baseUrl}/lib.min.js`;
      libScript.onload = () => {
        // 加载gui.js
        const guiScript = document.createElement('script');
        guiScript.src = `${baseUrl}/chunks/gui.js`;
        guiScript.onload = resolve;
        guiScript.onerror = reject;
        document.body.appendChild(guiScript);
      };
      libScript.onerror = reject;
      document.body.appendChild(libScript);
    });
  };

  // 加载项目
  const loadProject = (url) => {
    if (window.scratch && window.scratch.loadProject) {
      window.scratch.loadProject(url, (err) => {
        if (err) {
          console.error('加载项目失败:', err);
        }
      });
    }
  };

  // 获取项目文件
  const getProjectFile = (callback) => {
    if (window.scratch && window.scratch.getProjectFile) {
      window.scratch.getProjectFile(callback);
    }
  };

  // 获取项目截图
  const getProjectCover = (callback) => {
    if (window.scratch && window.scratch.getProjectCover) {
      window.scratch.getProjectCover(callback);
    }
  };

  return (
    <div 
      ref={containerRef} 
      id="scratch" 
      style={{ 
        width: '100%', 
        height: '100%',
        minHeight: '600px',
        background: '#f5f5f5'
      }}
    >
      {loading && (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100%' 
        }}>
          加载Scratch编辑器中...
        </div>
      )}
      {error && (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100%',
          color: 'red' 
        }}>
          加载失败: {error}
        </div>
      )}
    </div>
  );
};

export default ScratchEditor;
