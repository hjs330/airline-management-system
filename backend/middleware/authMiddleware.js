const { verify } = require('jsonwebtoken');

const checkAuth = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  
  if (!token) {
    return res.status(403).json({ message: '토큰이 필요합니다.' });
  }

  verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: '유효하지 않은 토큰입니다.' });
    }

    req.user = decoded; // 사용자 정보를 요청에 추가
    next();
  });
};

const checkAdmin = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  
  if (!token) {
    return res.status(403).json({ message: '토큰이 필요합니다.' });
  }

  verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: '유효하지 않은 토큰입니다.' });
    }

    if (decoded.role !== 'admin') {
      return res.status(403).json({ message: '권한이 없습니다.' });
    }

    req.user = decoded; // 사용자 정보를 요청에 추가
    next();
  });
};

module.exports = { checkAuth, checkAdmin }; 