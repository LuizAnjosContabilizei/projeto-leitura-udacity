import React, { Component } from "react";
import ListComments from "../components/ListComments";
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { getPostById, deletePostById } from "../actions/posts";
import Post from "../components/Post";
import RegisterDialog from "../components/RegisterDialog";
import RegisterComment from "../components/RegisterComment";
import { getComments } from "../actions/comments";
import { showSnack } from "../actions/snack";

class PostDetails extends Component {
  componentDidMount() {
    const { carregarPost, carregarComentarios, match } = this.props;
    const { post_id } = match.params;
    carregarPost(post_id);
    carregarComentarios(post_id);
  }

  componentWillReceiveProps({ post, history }) {
    debugger;
    if (!post.id || post.isDeleted) {
      history.push("/page/notfound/404");
    }
  }

  onRemoveSuccess = () => {
    this.props.mostrarSnack("Post removido com sucesso");
    this.props.history.push("/");
  };

  render() {
    const { post, comments, removerPost } = this.props;
    return (
      <div>
        <Link className="link-default" to="/">
          <Button>Voltar</Button>
        </Link>
        <RegisterDialog isEdit={true} post={post} />
        <Post
          id={post.id}
          titulo={post.title}
          autor={post.author}
          totalPontos={post.voteScore}
          totalComentarios={post.commentCount}
          categoria={post.category}
          corpo={post.body}
          isDetalhes={true}
          removerMethod={removerPost}
          onRemoveSuccess={this.onRemoveSuccess}
        />
        <RegisterComment idPost={post.id} />
        <ListComments comments={comments} />
      </div>
    );
  }
}

const MapStateToProps = state => {
  return {
    post: state.post,
    comments: state.comments
  };
};

const MapDispatchToProps = dispatch => ({
  carregarPost: id => dispatch(getPostById(id)),
  carregarComentarios: idPost => dispatch(getComments(idPost)),
  removerPost: (idPost, successCallback) =>
    dispatch(deletePostById(idPost, successCallback)),
  mostrarSnack: message => dispatch(showSnack(message))
});

export default connect(MapStateToProps, MapDispatchToProps)(PostDetails);
