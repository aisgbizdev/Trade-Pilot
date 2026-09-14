// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'topup_request_status.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

const TopupRequestStatus _$pending = const TopupRequestStatus._('pending');
const TopupRequestStatus _$approved = const TopupRequestStatus._('approved');
const TopupRequestStatus _$rejected = const TopupRequestStatus._('rejected');

TopupRequestStatus _$valueOf(String name) {
  switch (name) {
    case 'pending':
      return _$pending;
    case 'approved':
      return _$approved;
    case 'rejected':
      return _$rejected;
    default:
      throw ArgumentError(name);
  }
}

final BuiltSet<TopupRequestStatus> _$values =
    BuiltSet<TopupRequestStatus>(const <TopupRequestStatus>[
  _$pending,
  _$approved,
  _$rejected,
]);

class _$TopupRequestStatusMeta {
  const _$TopupRequestStatusMeta();
  TopupRequestStatus get pending => _$pending;
  TopupRequestStatus get approved => _$approved;
  TopupRequestStatus get rejected => _$rejected;
  TopupRequestStatus valueOf(String name) => _$valueOf(name);
  BuiltSet<TopupRequestStatus> get values => _$values;
}

abstract class _$TopupRequestStatusMixin {
  // ignore: non_constant_identifier_names
  _$TopupRequestStatusMeta get TopupRequestStatus =>
      const _$TopupRequestStatusMeta();
}

Serializer<TopupRequestStatus> _$topupRequestStatusSerializer =
    _$TopupRequestStatusSerializer();

class _$TopupRequestStatusSerializer
    implements PrimitiveSerializer<TopupRequestStatus> {
  static const Map<String, Object> _toWire = const <String, Object>{
    'pending': 'pending',
    'approved': 'approved',
    'rejected': 'rejected',
  };
  static const Map<Object, String> _fromWire = const <Object, String>{
    'pending': 'pending',
    'approved': 'approved',
    'rejected': 'rejected',
  };

  @override
  final Iterable<Type> types = const <Type>[TopupRequestStatus];
  @override
  final String wireName = 'TopupRequestStatus';

  @override
  Object serialize(Serializers serializers, TopupRequestStatus object,
          {FullType specifiedType = FullType.unspecified}) =>
      _toWire[object.name] ?? object.name;

  @override
  TopupRequestStatus deserialize(Serializers serializers, Object serialized,
          {FullType specifiedType = FullType.unspecified}) =>
      TopupRequestStatus.valueOf(
          _fromWire[serialized] ?? (serialized is String ? serialized : ''));
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
