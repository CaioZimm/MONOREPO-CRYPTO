const favoriteService = require('../services/favoriteService');
const { ValidationError } = require('../errors/AppError');

exports.toggleFavorite = async (req, res, next) => {
  try {
    const { cryptoName } = req.body;
    const userId = req.user.id;

    if (!cryptoName) {
      throw new ValidationError('Informe uma moeda para favoritar');
    }

    const favorite = await favoriteService.toggleFavorites(userId, cryptoName);

    return res.status(favorite.favorited ? 201 : 200).json({
      success: true,
      message: favorite.favorited ? 'Adicionado aos favoritos' : 'Removido dos favoritos',
      data: favorite,
    });
  } catch (error) {
    next(error);
  }
};

exports.listFavorites = async (req, res, next) => {
  try {
    const favorites = await favoriteService.listFavorites(req.user.id);

    return res.status(200).json({
      success: true,
      message: 'Lista de favoritos',
      data: favorites,
    });
  } catch (error) {
    next(error);
  }
};