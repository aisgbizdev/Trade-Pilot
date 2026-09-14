//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_collection/built_collection.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'topup_request_status.g.dart';

class TopupRequestStatus extends EnumClass {

  @BuiltValueEnumConst(wireName: r'pending')
  static const TopupRequestStatus pending = _$pending;
  @BuiltValueEnumConst(wireName: r'approved')
  static const TopupRequestStatus approved = _$approved;
  @BuiltValueEnumConst(wireName: r'rejected')
  static const TopupRequestStatus rejected = _$rejected;

  static Serializer<TopupRequestStatus> get serializer => _$topupRequestStatusSerializer;

  const TopupRequestStatus._(String name): super(name);

  static BuiltSet<TopupRequestStatus> get values => _$values;
  static TopupRequestStatus valueOf(String name) => _$valueOf(name);
}

/// Optionally, enum_class can generate a mixin to go with your enum for use
/// with Angular. It exposes your enum constants as getters. So, if you mix it
/// in to your Dart component class, the values become available to the
/// corresponding Angular template.
///
/// Trigger mixin generation by writing a line like this one next to your enum.
abstract class TopupRequestStatusMixin = Object with _$TopupRequestStatusMixin;

