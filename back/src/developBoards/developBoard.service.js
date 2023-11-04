const {
  DevelopBoardsRequestDTO,
  DevelopBoardsResponseDTO,
} = require("./developBoard.dto");
const { DevelopBoards } = require("../entity");

exports.createBoard = async (developBoardsRequestDTO) => {
  try {
    if (!(developBoardsRequestDTO instanceof DevelopBoardsRequestDTO)) {
      throw new Error("devDto 아닐때");
    }
    const { id, title, author, content, hit, category, img, likeCount } =
      developBoardsRequestDTO;

    const developBoard = DevelopBoards.build({
      id,
      title,
      author,
      content,
      hit,
      category,
      img,
      likeCount,
    });

    const response = await developBoard.save();
    const result = new DevelopBoardsResponseDTO(response);
    console.log(`response server `, response);
    console.log(`result server`, result);
  } catch (e) {
    throw new Error(`SERVICE createBoard ERROR:`, e.message);
  }
};
exports.findAllBoard = async () => {
  try {
    const result = await DevelopBoards.findAll();
    console.log(`findAll result :`, result);
    return result;
  } catch (e) {
    throw new Error(`SERVICE findAllBoard ERROR: ${e.message}`);
  }
};
exports.findOneBoard = async (developBoardId) => {
  try {
    const result = await DevelopBoards.findOne({
      raw: true,
      where: {
        id: developBoardId,
      },
    });

    console.log(`findOneBoard result :`, result);
    return result;
  } catch (e) {
    throw new Error(`SERVICE findOneBoard ERROR: ${e.message}`);
  }
};
exports.updateBoard = async (developBoardId, developBoardsRequestDTO) => {
  try {
    const result = await IdeaBoards.update(
      {
        title: developBoardsRequestDTO.title,
        content: developBoardsRequestDTO.content,
        category: developBoardsRequestDTO.category,
        img: developBoardsRequestDTO.img,
      },
      {
        where: {
          id: developBoardId,
        },
      }
    );
    console.log(`updateBoard result:`, result);
  } catch (e) {
    throw new Error(`SERVICE updateBoard ERROR: ${e.message}`);
  }
};
exports.deleteBoard = async (developBoardId) => {
  try {
    const result = await DevelopBoards.destroy({
      where: {
        id: developBoardId,
      },
    });
    console.log(`deleteBoard result :`, result);
    return result;
  } catch (e) {
    throw new Error(`SERVICE deleteBoard ERROR: ${e.message}`);
  }
};
