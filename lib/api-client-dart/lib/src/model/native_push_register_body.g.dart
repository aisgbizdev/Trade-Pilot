// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'native_push_register_body.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

const NativePushRegisterBodyPlatformEnum
    _$nativePushRegisterBodyPlatformEnum_android =
    const NativePushRegisterBodyPlatformEnum._('android');
const NativePushRegisterBodyPlatformEnum
    _$nativePushRegisterBodyPlatformEnum_ios =
    const NativePushRegisterBodyPlatformEnum._('ios');

NativePushRegisterBodyPlatformEnum _$nativePushRegisterBodyPlatformEnumValueOf(
    String name) {
  switch (name) {
    case 'android':
      return _$nativePushRegisterBodyPlatformEnum_android;
    case 'ios':
      return _$nativePushRegisterBodyPlatformEnum_ios;
    default:
      throw ArgumentError(name);
  }
}

final BuiltSet<NativePushRegisterBodyPlatformEnum>
    _$nativePushRegisterBodyPlatformEnumValues = BuiltSet<
        NativePushRegisterBodyPlatformEnum>(const <NativePushRegisterBodyPlatformEnum>[
  _$nativePushRegisterBodyPlatformEnum_android,
  _$nativePushRegisterBodyPlatformEnum_ios,
]);

Serializer<NativePushRegisterBodyPlatformEnum>
    _$nativePushRegisterBodyPlatformEnumSerializer =
    _$NativePushRegisterBodyPlatformEnumSerializer();

class _$NativePushRegisterBodyPlatformEnumSerializer
    implements PrimitiveSerializer<NativePushRegisterBodyPlatformEnum> {
  static const Map<String, Object> _toWire = const <String, Object>{
    'android': 'android',
    'ios': 'ios',
  };
  static const Map<Object, String> _fromWire = const <Object, String>{
    'android': 'android',
    'ios': 'ios',
  };

  @override
  final Iterable<Type> types = const <Type>[NativePushRegisterBodyPlatformEnum];
  @override
  final String wireName = 'NativePushRegisterBodyPlatformEnum';

  @override
  Object serialize(
          Serializers serializers, NativePushRegisterBodyPlatformEnum object,
          {FullType specifiedType = FullType.unspecified}) =>
      _toWire[object.name] ?? object.name;

  @override
  NativePushRegisterBodyPlatformEnum deserialize(
          Serializers serializers, Object serialized,
          {FullType specifiedType = FullType.unspecified}) =>
      NativePushRegisterBodyPlatformEnum.valueOf(
          _fromWire[serialized] ?? (serialized is String ? serialized : ''));
}

class _$NativePushRegisterBody extends NativePushRegisterBody {
  @override
  final String token;
  @override
  final NativePushRegisterBodyPlatformEnum platform;

  factory _$NativePushRegisterBody(
          [void Function(NativePushRegisterBodyBuilder)? updates]) =>
      (NativePushRegisterBodyBuilder()..update(updates))._build();

  _$NativePushRegisterBody._({required this.token, required this.platform})
      : super._();
  @override
  NativePushRegisterBody rebuild(
          void Function(NativePushRegisterBodyBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  NativePushRegisterBodyBuilder toBuilder() =>
      NativePushRegisterBodyBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is NativePushRegisterBody &&
        token == other.token &&
        platform == other.platform;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, token.hashCode);
    _$hash = $jc(_$hash, platform.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'NativePushRegisterBody')
          ..add('token', token)
          ..add('platform', platform))
        .toString();
  }
}

class NativePushRegisterBodyBuilder
    implements Builder<NativePushRegisterBody, NativePushRegisterBodyBuilder> {
  _$NativePushRegisterBody? _$v;

  String? _token;
  String? get token => _$this._token;
  set token(String? token) => _$this._token = token;

  NativePushRegisterBodyPlatformEnum? _platform;
  NativePushRegisterBodyPlatformEnum? get platform => _$this._platform;
  set platform(NativePushRegisterBodyPlatformEnum? platform) =>
      _$this._platform = platform;

  NativePushRegisterBodyBuilder() {
    NativePushRegisterBody._defaults(this);
  }

  NativePushRegisterBodyBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _token = $v.token;
      _platform = $v.platform;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(NativePushRegisterBody other) {
    _$v = other as _$NativePushRegisterBody;
  }

  @override
  void update(void Function(NativePushRegisterBodyBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  NativePushRegisterBody build() => _build();

  _$NativePushRegisterBody _build() {
    final _$result = _$v ??
        _$NativePushRegisterBody._(
          token: BuiltValueNullFieldError.checkNotNull(
              token, r'NativePushRegisterBody', 'token'),
          platform: BuiltValueNullFieldError.checkNotNull(
              platform, r'NativePushRegisterBody', 'platform'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
