// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'native_push_test_result.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

const NativePushTestResultFailuresEnum
    _$nativePushTestResultFailuresEnum_unregistered =
    const NativePushTestResultFailuresEnum._('unregistered');
const NativePushTestResultFailuresEnum _$nativePushTestResultFailuresEnum_auth =
    const NativePushTestResultFailuresEnum._('auth');
const NativePushTestResultFailuresEnum
    _$nativePushTestResultFailuresEnum_invalid =
    const NativePushTestResultFailuresEnum._('invalid');
const NativePushTestResultFailuresEnum
    _$nativePushTestResultFailuresEnum_network =
    const NativePushTestResultFailuresEnum._('network');

NativePushTestResultFailuresEnum _$nativePushTestResultFailuresEnumValueOf(
    String name) {
  switch (name) {
    case 'unregistered':
      return _$nativePushTestResultFailuresEnum_unregistered;
    case 'auth':
      return _$nativePushTestResultFailuresEnum_auth;
    case 'invalid':
      return _$nativePushTestResultFailuresEnum_invalid;
    case 'network':
      return _$nativePushTestResultFailuresEnum_network;
    default:
      throw ArgumentError(name);
  }
}

final BuiltSet<NativePushTestResultFailuresEnum>
    _$nativePushTestResultFailuresEnumValues = BuiltSet<
        NativePushTestResultFailuresEnum>(const <NativePushTestResultFailuresEnum>[
  _$nativePushTestResultFailuresEnum_unregistered,
  _$nativePushTestResultFailuresEnum_auth,
  _$nativePushTestResultFailuresEnum_invalid,
  _$nativePushTestResultFailuresEnum_network,
]);

Serializer<NativePushTestResultFailuresEnum>
    _$nativePushTestResultFailuresEnumSerializer =
    _$NativePushTestResultFailuresEnumSerializer();

class _$NativePushTestResultFailuresEnumSerializer
    implements PrimitiveSerializer<NativePushTestResultFailuresEnum> {
  static const Map<String, Object> _toWire = const <String, Object>{
    'unregistered': 'unregistered',
    'auth': 'auth',
    'invalid': 'invalid',
    'network': 'network',
  };
  static const Map<Object, String> _fromWire = const <Object, String>{
    'unregistered': 'unregistered',
    'auth': 'auth',
    'invalid': 'invalid',
    'network': 'network',
  };

  @override
  final Iterable<Type> types = const <Type>[NativePushTestResultFailuresEnum];
  @override
  final String wireName = 'NativePushTestResultFailuresEnum';

  @override
  Object serialize(
          Serializers serializers, NativePushTestResultFailuresEnum object,
          {FullType specifiedType = FullType.unspecified}) =>
      _toWire[object.name] ?? object.name;

  @override
  NativePushTestResultFailuresEnum deserialize(
          Serializers serializers, Object serialized,
          {FullType specifiedType = FullType.unspecified}) =>
      NativePushTestResultFailuresEnum.valueOf(
          _fromWire[serialized] ?? (serialized is String ? serialized : ''));
}

class _$NativePushTestResult extends NativePushTestResult {
  @override
  final int targeted;
  @override
  final int accepted;
  @override
  final BuiltList<NativePushTestResultFailuresEnum> failures;

  factory _$NativePushTestResult(
          [void Function(NativePushTestResultBuilder)? updates]) =>
      (NativePushTestResultBuilder()..update(updates))._build();

  _$NativePushTestResult._(
      {required this.targeted, required this.accepted, required this.failures})
      : super._();
  @override
  NativePushTestResult rebuild(
          void Function(NativePushTestResultBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  NativePushTestResultBuilder toBuilder() =>
      NativePushTestResultBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is NativePushTestResult &&
        targeted == other.targeted &&
        accepted == other.accepted &&
        failures == other.failures;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, targeted.hashCode);
    _$hash = $jc(_$hash, accepted.hashCode);
    _$hash = $jc(_$hash, failures.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'NativePushTestResult')
          ..add('targeted', targeted)
          ..add('accepted', accepted)
          ..add('failures', failures))
        .toString();
  }
}

class NativePushTestResultBuilder
    implements Builder<NativePushTestResult, NativePushTestResultBuilder> {
  _$NativePushTestResult? _$v;

  int? _targeted;
  int? get targeted => _$this._targeted;
  set targeted(int? targeted) => _$this._targeted = targeted;

  int? _accepted;
  int? get accepted => _$this._accepted;
  set accepted(int? accepted) => _$this._accepted = accepted;

  ListBuilder<NativePushTestResultFailuresEnum>? _failures;
  ListBuilder<NativePushTestResultFailuresEnum> get failures =>
      _$this._failures ??= ListBuilder<NativePushTestResultFailuresEnum>();
  set failures(ListBuilder<NativePushTestResultFailuresEnum>? failures) =>
      _$this._failures = failures;

  NativePushTestResultBuilder() {
    NativePushTestResult._defaults(this);
  }

  NativePushTestResultBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _targeted = $v.targeted;
      _accepted = $v.accepted;
      _failures = $v.failures.toBuilder();
      _$v = null;
    }
    return this;
  }

  @override
  void replace(NativePushTestResult other) {
    _$v = other as _$NativePushTestResult;
  }

  @override
  void update(void Function(NativePushTestResultBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  NativePushTestResult build() => _build();

  _$NativePushTestResult _build() {
    _$NativePushTestResult _$result;
    try {
      _$result = _$v ??
          _$NativePushTestResult._(
            targeted: BuiltValueNullFieldError.checkNotNull(
                targeted, r'NativePushTestResult', 'targeted'),
            accepted: BuiltValueNullFieldError.checkNotNull(
                accepted, r'NativePushTestResult', 'accepted'),
            failures: failures.build(),
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'failures';
        failures.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'NativePushTestResult', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
