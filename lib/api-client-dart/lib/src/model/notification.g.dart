// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'notification.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

const NotificationTypeEnum _$notificationTypeEnum_info =
    const NotificationTypeEnum._('info');
const NotificationTypeEnum _$notificationTypeEnum_warning =
    const NotificationTypeEnum._('warning');
const NotificationTypeEnum _$notificationTypeEnum_error =
    const NotificationTypeEnum._('error');

NotificationTypeEnum _$notificationTypeEnumValueOf(String name) {
  switch (name) {
    case 'info':
      return _$notificationTypeEnum_info;
    case 'warning':
      return _$notificationTypeEnum_warning;
    case 'error':
      return _$notificationTypeEnum_error;
    default:
      throw ArgumentError(name);
  }
}

final BuiltSet<NotificationTypeEnum> _$notificationTypeEnumValues =
    BuiltSet<NotificationTypeEnum>(const <NotificationTypeEnum>[
  _$notificationTypeEnum_info,
  _$notificationTypeEnum_warning,
  _$notificationTypeEnum_error,
]);

Serializer<NotificationTypeEnum> _$notificationTypeEnumSerializer =
    _$NotificationTypeEnumSerializer();

class _$NotificationTypeEnumSerializer
    implements PrimitiveSerializer<NotificationTypeEnum> {
  static const Map<String, Object> _toWire = const <String, Object>{
    'info': 'info',
    'warning': 'warning',
    'error': 'error',
  };
  static const Map<Object, String> _fromWire = const <Object, String>{
    'info': 'info',
    'warning': 'warning',
    'error': 'error',
  };

  @override
  final Iterable<Type> types = const <Type>[NotificationTypeEnum];
  @override
  final String wireName = 'NotificationTypeEnum';

  @override
  Object serialize(Serializers serializers, NotificationTypeEnum object,
          {FullType specifiedType = FullType.unspecified}) =>
      _toWire[object.name] ?? object.name;

  @override
  NotificationTypeEnum deserialize(Serializers serializers, Object serialized,
          {FullType specifiedType = FullType.unspecified}) =>
      NotificationTypeEnum.valueOf(
          _fromWire[serialized] ?? (serialized is String ? serialized : ''));
}

class _$Notification extends Notification {
  @override
  final int id;
  @override
  final int? userId;
  @override
  final String? targetRole;
  @override
  final String title;
  @override
  final String message;
  @override
  final NotificationTypeEnum type;
  @override
  final DateTime? readAt;
  @override
  final DateTime createdAt;

  factory _$Notification([void Function(NotificationBuilder)? updates]) =>
      (NotificationBuilder()..update(updates))._build();

  _$Notification._(
      {required this.id,
      this.userId,
      this.targetRole,
      required this.title,
      required this.message,
      required this.type,
      this.readAt,
      required this.createdAt})
      : super._();
  @override
  Notification rebuild(void Function(NotificationBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  NotificationBuilder toBuilder() => NotificationBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is Notification &&
        id == other.id &&
        userId == other.userId &&
        targetRole == other.targetRole &&
        title == other.title &&
        message == other.message &&
        type == other.type &&
        readAt == other.readAt &&
        createdAt == other.createdAt;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, id.hashCode);
    _$hash = $jc(_$hash, userId.hashCode);
    _$hash = $jc(_$hash, targetRole.hashCode);
    _$hash = $jc(_$hash, title.hashCode);
    _$hash = $jc(_$hash, message.hashCode);
    _$hash = $jc(_$hash, type.hashCode);
    _$hash = $jc(_$hash, readAt.hashCode);
    _$hash = $jc(_$hash, createdAt.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'Notification')
          ..add('id', id)
          ..add('userId', userId)
          ..add('targetRole', targetRole)
          ..add('title', title)
          ..add('message', message)
          ..add('type', type)
          ..add('readAt', readAt)
          ..add('createdAt', createdAt))
        .toString();
  }
}

class NotificationBuilder
    implements Builder<Notification, NotificationBuilder> {
  _$Notification? _$v;

  int? _id;
  int? get id => _$this._id;
  set id(int? id) => _$this._id = id;

  int? _userId;
  int? get userId => _$this._userId;
  set userId(int? userId) => _$this._userId = userId;

  String? _targetRole;
  String? get targetRole => _$this._targetRole;
  set targetRole(String? targetRole) => _$this._targetRole = targetRole;

  String? _title;
  String? get title => _$this._title;
  set title(String? title) => _$this._title = title;

  String? _message;
  String? get message => _$this._message;
  set message(String? message) => _$this._message = message;

  NotificationTypeEnum? _type;
  NotificationTypeEnum? get type => _$this._type;
  set type(NotificationTypeEnum? type) => _$this._type = type;

  DateTime? _readAt;
  DateTime? get readAt => _$this._readAt;
  set readAt(DateTime? readAt) => _$this._readAt = readAt;

  DateTime? _createdAt;
  DateTime? get createdAt => _$this._createdAt;
  set createdAt(DateTime? createdAt) => _$this._createdAt = createdAt;

  NotificationBuilder() {
    Notification._defaults(this);
  }

  NotificationBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _id = $v.id;
      _userId = $v.userId;
      _targetRole = $v.targetRole;
      _title = $v.title;
      _message = $v.message;
      _type = $v.type;
      _readAt = $v.readAt;
      _createdAt = $v.createdAt;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(Notification other) {
    _$v = other as _$Notification;
  }

  @override
  void update(void Function(NotificationBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  Notification build() => _build();

  _$Notification _build() {
    final _$result = _$v ??
        _$Notification._(
          id: BuiltValueNullFieldError.checkNotNull(id, r'Notification', 'id'),
          userId: userId,
          targetRole: targetRole,
          title: BuiltValueNullFieldError.checkNotNull(
              title, r'Notification', 'title'),
          message: BuiltValueNullFieldError.checkNotNull(
              message, r'Notification', 'message'),
          type: BuiltValueNullFieldError.checkNotNull(
              type, r'Notification', 'type'),
          readAt: readAt,
          createdAt: BuiltValueNullFieldError.checkNotNull(
              createdAt, r'Notification', 'createdAt'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
