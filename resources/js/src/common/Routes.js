export const route = (name, options = {}) => {
    let to;
    switch (name) {
        case 'welcome':
            to= '/'
            break;
        case 'home':
            to= '/home'
            break
        case 'create_post':
            to = "/create_post"
            break
        case 'upload_post_media':
            to="/upload_post_media/:id"
            break;
        case 'view_content':
            to = '/content/:id'
            break
        default:
            break;
    }

    return to;
}