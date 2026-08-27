// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'broadcast.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

const BroadcastAudienceTypeEnum _$broadcastAudienceTypeEnum_all =
    const BroadcastAudienceTypeEnum._('all');
const BroadcastAudienceTypeEnum _$broadcastAudienceTypeEnum_role =
    const BroadcastAudienceTypeEnum._('role');
const BroadcastAudienceTypeEnum _$broadcastAudienceTypeEnum_tag =
    const BroadcastAudienceTypeEnum._('tag');

BroadcastAudienceTypeEnum _$broadcastAudienceTypeEnumValueOf(String name) {
  switch (name) {
    case 'all':
      return _$broadcastAudienceTypeEnum_all;
    case 'role':
      return _$broadcastAudienceTypeEnum_role;
    case 'tag':
      return _$broadcastAudienceTypeEnum_tag;
    default:
      throw ArgumentError(name);
  }
}

final BuiltSet<BroadcastAudienceTypeEnum> _$broadcastAudienceTypeEnumValues =
    BuiltSet<BroadcastAudienceTypeEnum>(const <BroadcastAudienceTypeEnum>[
  _$broadcastAudienceTypeEnum_all,
  _$broadcastAudienceTypeEnum_role,
  _$broadcastAudienceTypeEnum_tag,
]);

Serializer<BroadcastAudienceTypeEnum> _$broadcastAudienceTypeEnumSerializer =
    _$BroadcastAudienceTypeEnumSerializer();

class _$BroadcastAudienceTypeEnumSerializer
    implements PrimitiveSerializer<BroadcastAudienceTypeEnum> {
  static const Map<String, Object> _toWire = const <String, Object>{
    'all': 'all',
    'role': 'role',
    'tag': 'tag',
  };
  static const Map<Object, String> _fromWire = const <Object, String>{
    'all': 'all',
    'role': 'role',
    'tag': 'tag',
  };

  @override
  final Iterable<Type> types = const <Type>[BroadcastAudienceTypeEnum];
  @override
  final String wireName = 'BroadcastAudienceTypeEnum';

  @override
  Object serialize(Serializers serializers, BroadcastAudienceTypeEnum object,
          {FullType specifiedType = FullType.unspecified}) =>
      _toWire[object.name] ?? object.name;

  @override
  BroadcastAudienceTypeEnum deserialize(
          Serializers serializers, Object serialized,
          {FullType specifiedType = FullType.unspecified}) =>
      BroadcastAudienceTypeEnum.valueOf(
          _fromWire[serialized] ?? (serialized is String ? serialized : ''));
}

class _$Broadcast extends Broadcast {
  @override
  final int id;
  @override
  final int? senderId;
  @override
  final String? senderName;
  @override
  final String title;
  @override
  final String message;
  @override
  final BroadcastAudienceTypeEnum audienceType;
  @override
  final String? audienceValue;
  @override
  final int recipientCount;
  @override
  final DateTime createdAt;

  factory _$Broadcast([void Function(BroadcastBuilder)? updates]) =>
      (BroadcastBuilder()..update(updates))._build();

  _$Broadcast._(
      {required this.id,
      this.senderId,
      this.senderName,
      required this.title,
      required this.message,
      required this.audienceType,
      this.audienceValue,
      required this.recipientCount,
      required this.createdAt})
      : super._();
  @override
  Broadcast rebuild(void Function(BroadcastBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  BroadcastBuilder toBuilder() => BroadcastBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is Broadcast &&
        id == other.id &&
        senderId == other.senderId &&
        senderName == other.senderName &&
        title == other.title &&
        message == other.message &&
        audienceType == other.audienceType &&
        audienceValue == other.audienceValue &&
        recipientCount == other.recipientCount &&
        createdAt == other.createdAt;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, id.hashCode);
    _$hash = $jc(_$hash, senderId.hashCode);
    _$hash = $jc(_$hash, senderName.hashCode);
    _$hash = $jc(_$hash, title.hashCode);
    _$hash = $jc(_$hash, message.hashCode);
    _$hash = $jc(_$hash, audienceType.hashCode);
    _$hash = $jc(_$hash, audienceValue.hashCode);
    _$hash = $jc(_$hash, recipientCount.hashCode);
    _$hash = $jc(_$hash, createdAt.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'Broadcast')
          ..add('id', id)
          ..add('senderId', senderId)
          ..add('senderName', senderName)
          ..add('title', title)
          ..add('message', message)
          ..add('audienceType', audienceType)
          ..add('audienceValue', audienceValue)
          ..add('recipientCount', recipientCount)
          ..add('createdAt', createdAt))
        .toString();
  }
}

class BroadcastBuilder implements Builder<Broadcast, BroadcastBuilder> {
  _$Broadcast? _$v;

  int? _id;
  int? get id => _$this._id;
  set id(int? id) => _$this._id = id;

  int? _senderId;
  int? get senderId => _$this._senderId;
  set senderId(int? senderId) => _$this._senderId = senderId;

  String? _senderName;
  String? get senderName => _$this._senderName;
  set senderName(String? senderName) => _$this._senderName = senderName;

  String? _title;
  String? get title => _$this._title;
  set title(String? title) => _$this._title = title;

  String? _message;
  String? get message => _$this._message;
  set message(String? message) => _$this._message = message;

  BroadcastAudienceTypeEnum? _audienceType;
  BroadcastAudienceTypeEnum? get audienceType => _$this._audienceType;
  set audienceType(BroadcastAudienceTypeEnum? audienceType) =>
      _$this._audienceType = audienceType;

  String? _audienceValue;
  String? get audienceValue => _$this._audienceValue;
  set audienceValue(String? audienceValue) =>
      _$this._audienceValue = audienceValue;

  int? _recipientCount;
  int? get recipientCount => _$this._recipientCount;
  set recipientCount(int? recipientCount) =>
      _$this._recipientCount = recipientCount;

  DateTime? _createdAt;
  DateTime? get createdAt => _$this._createdAt;
  set createdAt(DateTime? createdAt) => _$this._createdAt = createdAt;

  BroadcastBuilder() {
    Broadcast._defaults(this);
  }

  BroadcastBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _id = $v.id;
      _senderId = $v.senderId;
      _senderName = $v.senderName;
      _title = $v.title;
      _message = $v.message;
      _audienceType = $v.audienceType;
      _audienceValue = $v.audienceValue;
      _recipientCount = $v.recipientCount;
      _createdAt = $v.createdAt;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(Broadcast other) {
    _$v = other as _$Broadcast;
  }

  @override
  void update(void Function(BroadcastBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  Broadcast build() => _build();

  _$Broadcast _build() {
    final _$result = _$v ??
        _$Broadcast._(
          id: BuiltValueNullFieldError.checkNotNull(id, r'Broadcast', 'id'),
          senderId: senderId,
          senderName: senderName,
          title: BuiltValueNullFieldError.checkNotNull(
              title, r'Broadcast', 'title'),
          message: BuiltValueNullFieldError.checkNotNull(
              message, r'Broadcast', 'message'),
          audienceType: BuiltValueNullFieldError.checkNotNull(
              audienceType, r'Broadcast', 'audienceType'),
          audienceValue: audienceValue,
          recipientCount: BuiltValueNullFieldError.checkNotNull(
              recipientCount, r'Broadcast', 'recipientCount'),
          createdAt: BuiltValueNullFieldError.checkNotNull(
              createdAt, r'Broadcast', 'createdAt'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
