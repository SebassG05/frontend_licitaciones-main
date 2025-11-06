const Container = ({
    as: Component = 'div',
    className = '',
    children,
    ...props
}) => {
    return (
        <Component
            className={`container mx-auto px-4 sm:px-6 lg:px-8 ${className}`}
            {...props}
        >
            {children}
        </Component>
    );
};

export default Container;